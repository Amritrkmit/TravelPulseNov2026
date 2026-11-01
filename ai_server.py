"""Travel Pulse: local Excel-grounded agent. No database required."""
import os, json, re, collections
from pathlib import Path
from functools import lru_cache
from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from dotenv import load_dotenv
from openai import OpenAI
import openpyxl

BASE=Path(__file__).resolve().parent
load_dotenv(BASE/'.env')
app=FastAPI(title='Travel Pulse Agent')
# CORS: which web pages may call this server from the browser.
#   • any page on localhost / 127.0.0.1 (any port)
#   • the published dashboard on GitHub Pages (below). Add more with ALLOWED_ORIGINS="https://a.example,https://b.example" in .env
# This server only listens on 127.0.0.1, so "the visitor's own computer" is the only machine that can ever reach it.
_EXTRA_ORIGINS=[o.strip() for o in os.getenv('ALLOWED_ORIGINS','').split(',') if o.strip()]
ALLOWED_ORIGINS=['https://amritrkmit.github.io']+_EXTRA_ORIGINS
app.add_middleware(CORSMiddleware,allow_origins=ALLOWED_ORIGINS,allow_origin_regex=r'^https?://(localhost|127\.0\.0\.1)(:\d+)?$',allow_methods=['GET','POST'],allow_headers=['Content-Type'])

# Chrome / Edge ask permission before a PUBLIC website talks to a server on the visitor's own computer
# ("Private Network Access"). Its preflight request needs this extra header in the answer.
@app.middleware('http')
async def private_network_access(request,call_next):
    resp=await call_next(request)
    if request.headers.get('access-control-request-private-network','').lower()=='true':
        resp.headers['Access-Control-Allow-Private-Network']='true'
    return resp

@lru_cache(maxsize=1)
def data():
    wb=openpyxl.load_workbook(BASE/'survey_data.xlsx',read_only=True,data_only=True)
    ws=wb.active
    ws.reset_dimensions()
    it=ws.iter_rows(values_only=True)
    headers=[str(v or '') for v in next(it)]
    rows=[tuple(r) for r in it if any(v is not None for v in r)]
    wb.close()
    return headers,rows

def columns(term):
    h,_=data()
    q=term.casefold().strip()
    if not q:return []
    # Prefer exact survey question IDs, such as Q3_1, Q13, QS0.
    if re.fullmatch(r'[a-zA-Z]+[0-9]+(?:_[0-9]+)*',term.strip()):
        found=[i for i,v in enumerate(h) if v.split(' : ')[0].casefold()==q]
        if found:return found
    return [i for i,v in enumerate(h) if q in v.casefold()][:40]

def describe_columns(query):
    h,_=data()
    found=columns(query)
    return {'matching_columns':[{'index':i,'question':h[i][:240]} for i in found], 'count':len(found), 'tip':'Use index in summarize_column or cross_tab. Search short terms or question codes.'}

def summarize_column(index,filter_index=None,filter_value=None,top=20):
    h,rows=data()
    if not 0<=index<len(h):return {'error':'invalid index'}
    if filter_index is not None and not 0<=filter_index<len(h):return {'error':'invalid filter index'}
    selected=[r for r in rows if filter_index is None or str(r[filter_index] or '').casefold()==str(filter_value or '').casefold()]
    counts=collections.Counter(str(r[index]).strip() for r in selected if r[index] is not None and str(r[index]).strip())
    denominator=sum(counts.values())
    return {'question':h[index], 'filter':None if filter_index is None else {'question':h[filter_index],'value':filter_value},'sample_rows':len(selected),'valid_responses':denominator,'missing':len(selected)-denominator,'values':[{'answer':v,'count':n,'percent':round(n/denominator*100,2) if denominator else 0} for v,n in counts.most_common(min(top,50))]}

def cross_tab(index,group_index,filter_index=None,filter_value=None):
    h,rows=data()
    if any(not 0<=i<len(h) for i in [index,group_index]+([] if filter_index is None else [filter_index])):return {'error':'invalid index'}
    selected=[r for r in rows if filter_index is None or str(r[filter_index] or '').casefold()==str(filter_value or '').casefold()]
    by=collections.defaultdict(collections.Counter)
    for r in selected:
        if r[group_index] is not None and r[index] is not None and str(r[group_index]).strip() and str(r[index]).strip():
            by[str(r[group_index])][str(r[index])]+=1
    out=[]
    for group,counts in sorted(by.items(),key=lambda x:-sum(x[1].values()))[:35]:
        total=sum(counts.values());out.append({'group':group,'valid_n':total,'answers':[{'value':v,'count':n,'percent':round(n/total*100,2)} for v,n in counts.most_common(25)]})
    return {'question':h[index],'group_by':h[group_index],'groups':out,'filter':None if filter_index is None else {'question':h[filter_index],'value':filter_value}}


def analyze_survey(index, filters=None, top=20, group_index=None):
    """Deterministic survey distribution with multiple AND filters. Filters are exact matching.
    A filter may have `values` for OR matching within that field.
    """
    h,rows=data()
    filters=filters or []
    if not 0<=index<len(h):return {'error':'invalid target index'}
    if group_index is not None and not 0<=group_index<len(h):return {'error':'invalid group index'}
    for f in filters:
        if not isinstance(f,dict) or not isinstance(f.get('index'),int) or not 0<=f['index']<len(h):return {'error':'invalid filter index'}
        if 'value' not in f and 'values' not in f:return {'error':'filter requires value or values'}
    def norm(v):return str(v).strip().casefold() if v is not None else ''
    def matches(r,f):
        allowed=f.get('values', [f.get('value')])
        if not isinstance(allowed,list):return False
        return norm(r[f['index']]) in {norm(v) for v in allowed}
    selected=[r for r in rows if all(matches(r,f) for f in filters)]
    def distribution(rs):
        vals=[str(r[index]).strip() for r in rs if r[index] is not None and str(r[index]).strip()]
        c=collections.Counter(vals); n=len(vals)
        return {'sample_size':len(rs),'valid_base':n,'missing':len(rs)-n,'values':[{'answer':v,'count':k,'percent':round(100*k/n,2) if n else 0} for v,k in c.most_common(max(1,min(top,50)))]}
    result={'question':h[index],'filters':[{'field':h[f['index']],'values':f.get('values',[f.get('value')])} for f in filters], 'unweighted':True}
    if group_index is None:result.update(distribution(selected))
    else:
        groups=collections.defaultdict(list)
        for r in selected:
            if norm(r[group_index]):groups[str(r[group_index]).strip()].append(r)
        result['group_by']=h[group_index]
        result['groups']=[{'group':g,**distribution(rs)} for g,rs in sorted(groups.items(),key=lambda x:-len(x[1]))[:40]]
    return result

TOOLS=[
 {'type':'function','function':{'name':'dashboard_json_catalog','description':'Find dashboard JSON files by name to identify corroborating data sources; does not itself validate metrics.','parameters':{'type':'object','properties':{'query':{'type':'string'},'limit':{'type':'integer'}}}}},
 {'type':'function','function':{'name':'survey_profile','description':'Get authoritative master dataset metadata and known question codes.','parameters':{'type':'object','properties':{}}}},
 {'type':'function','function':{'name':'search_fields','description':'Search full workbook headers to identify a survey field or question code.','parameters':{'type':'object','properties':{'query':{'type':'string'}},'required':['query']}}},
 {'type':'function','function':{'name':'analyze','description':'Calculate counts and valid-base percentages for any single-response field; supports AND filters, OR values and grouped comparisons. Use QS0 for country, Q14 for airline, Q21 for hotel, Q10 for budget, QHIDCLUSTER for region.','parameters':{'type':'object','properties':{'field_code':{'type':'string'},'filters':{'type':'array','items':{'type':'object','properties':{'field':{'type':'string'},'value':{'type':'string'},'values':{'type':'array','items':{'type':'string'}},'operator':{'type':'string','enum':['equals','contains','not_equals']}},'required':['field']}},'group_by':{'type':'string'},'top':{'type':'integer'}},'required':['field_code']}}},
 {'type':'function','function':{'name':'multiselect','description':'Calculate multi-select checkbox question distributions such as Q16 (airline considerations), Q9 (destination considerations), Q11 (budget reduction methods). Use valid eligible respondent base.','parameters':{'type':'object','properties':{'prefix':{'type':'string'},'filters':{'type':'array','items':{'type':'object','properties':{'field':{'type':'string'},'value':{'type':'string'},'values':{'type':'array','items':{'type':'string'}},'operator':{'type':'string'}},'required':['field']}},'top':{'type':'integer'}},'required':['prefix']}}}
]
from agent_instructions import SYSTEM
from answer_filter import strip_counts, has_small_base, finalize_answer
from survey_engine import analyze, multiselect, search_fields, survey_profile, dashboard_json_catalog

FUNCTIONS = {
    'analyze': analyze,
    'multiselect': multiselect,
    'search_fields': search_fields,
    'survey_profile': survey_profile,
    'dashboard_json_catalog': dashboard_json_catalog,
}

class ChatRequest(BaseModel):
    message:str=Field(min_length=1,max_length=4000)
    history:list[dict]=Field(default_factory=list)

@app.get('/api/health')
def health():
    h,r=data();return {'ok':True,'survey_rows':len(r),'columns':len(h),'api_key_configured':bool(os.getenv('OPENAI_API_KEY'))}

@app.post('/api/chat')
def chat(req:ChatRequest):
    if not os.getenv('OPENAI_API_KEY'):raise HTTPException(503,'Set OPENAI_API_KEY in .env and restart server.')
    h,rows=data()
    client=OpenAI(api_key=os.environ['OPENAI_API_KEY'],timeout=45,max_retries=1)
    messages=[{'role':'system','content':SYSTEM+f'\nWorkbook contains {len(rows)} respondent rows and {len(h)} columns. Mandatory: call a calculation tool before answering any numerical question. QS0 is source country, Q14 preferred airline, Q21 hotel brand, Q10 budget change. For grouped comparisons use analyze with group_by; for Q9/Q11/Q16 checkbox questions use multiselect. A zero base must be investigated by checking field mappings and filter values. Never present a JSON catalog as computed evidence.'}]
    for m in req.history[-10:]:
        if m.get('role') in ('user','assistant') and isinstance(m.get('content'),str):messages.append({'role':m['role'],'content':m['content'][:3000]})
    # Frontend history already includes current user turn.
    if not messages or messages[-1].get('role')!='user' or messages[-1].get('content')!=req.message:
        messages.append({'role':'user','content':req.message})
    try:
        small_base=False
        for _ in range(10):
            response=client.chat.completions.create(model=os.getenv('OPENAI_MODEL','gpt-4o-mini'),messages=messages,tools=TOOLS,tool_choice='required' if _ == 0 else 'auto',temperature=0)
            msg=response.choices[0].message
            messages.append(msg)
            if not msg.tool_calls:return {'answer':finalize_answer(msg.content or 'No supported answer found in the survey.',small_base)}
            for call in msg.tool_calls:
                try:
                    args=json.loads(call.function.arguments)
                    result=strip_counts(FUNCTIONS[call.function.name](**args))   # the model never sees counts / bases
                    small_base=small_base or has_small_base(result)
                except Exception as e:result={'error':str(e)}
                messages.append({'role':'tool','tool_call_id':call.id,'content':json.dumps(result,ensure_ascii=False,default=str)[:25000]})
        return {'answer':'This question requires more analysis steps. Please narrow the question to a specific metric or market.'}
    except Exception as e:
        raise HTTPException(502,f'AI service error: {type(e).__name__}: {str(e)[:300]}')

# The server hands out the dashboard (HTML, JS, CSS, JSON data, images) but NEVER its own files:
# .env (API key), source code, the raw survey Excel, .git, notes. Without this, anyone who can reach the server
# (same Wi-Fi, a shared tunnel link ...) could download http://<address>/.env
STATIC_BLOCK=re.compile(
    r'(^|/)\.'                                                   # any dotfile / dot-folder: .env .git .gitignore .venv
    r'|:'                                                          # Windows alternate data streams (file.py::$DATA)
    r'|\.(py|pyc|bat|cmd|sh|env|md|txt|xlsx|xls|xlsm|log|toml|cfg|ini|lock|ya?ml)$'
    r'|(^|/)(__pycache__|knowledge|tests|node_modules|venv)(/|$)'
    r'|(^|/)package(-lock)?\.json$',re.I)

class SafeStaticFiles(StaticFiles):
    async def get_response(self,path:str,scope):
        p=path.replace('\\','/').rstrip(' .')                    # Windows ignores trailing dots/spaces ("ai_server.py.")
        if STATIC_BLOCK.search(p) or STATIC_BLOCK.search(path):
            raise HTTPException(404,'Not Found')
        return await super().get_response(path,scope)

app.mount('/',SafeStaticFiles(directory=str(BASE),html=True),name='dashboard')
