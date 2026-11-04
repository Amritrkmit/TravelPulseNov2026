"""Validated respondent-level survey operations. All indexes are zero-based internally."""
import collections, re
from functools import lru_cache
from pathlib import Path
import openpyxl

ROOT=Path(__file__).resolve().parent
ALIASES={'uae':'united arab emirates','uk':'united kingdom','usa':'united states of america','us':'united states of america','united states':'united states of america','south korea':'south korea'}

def norm(value):
    s=re.sub(r'\s+',' ',str(value or '').strip()).casefold()
    return ALIASES.get(s,s)

@lru_cache(maxsize=1)
def workbook():
    wb=openpyxl.load_workbook(ROOT/'survey_data.xlsx',read_only=True,data_only=True)
    ws=wb.active; ws.reset_dimensions(); it=ws.iter_rows(values_only=True)
    headers=[str(x or '') for x in next(it)]
    records=[r for r in it if any(v is not None for v in r)]
    wb.close()
    return headers,records

def field(code):
    h,_=workbook(); code=str(code).strip()
    if code.isdigit():
        i=int(code)
        if 0<=i<len(h):return i
        raise ValueError('Invalid column index')
    exact=[i for i,v in enumerate(h) if v.split(':',1)[0].strip().casefold()==code.casefold()]
    if len(exact)==1:return exact[0]
    if len(exact)>1:raise ValueError(f'Ambiguous field {code}: {len(exact)} matches')
    raise ValueError(f'Unknown field code {code}. Call search_fields to find a mapping.')

def search_fields(query,limit=18):
    h,_=workbook(); q=str(query).strip().casefold()
    if len(q)<2:return {'error':'Use at least two characters'}
    found=[{'code':v.split(':',1)[0].strip(),'index':i,'label':v[:200]} for i,v in enumerate(h) if q in v.casefold()]
    return {'fields':found[:min(30,max(1,limit))],'matches':len(found)}

def matching(record,filter_spec):
    idx=field(filter_spec['field']); val=norm(record[idx]); choices=filter_spec.get('values',[filter_spec.get('value')])
    if not isinstance(choices,list):raise ValueError('values must be an array')
    choices=[norm(x) for x in choices]
    op=filter_spec.get('operator','equals')
    if op=='equals':return val in choices
    if op=='contains':return any(x in val for x in choices if x)
    if op=='not_equals':return val not in choices
    raise ValueError('Unknown filter operator')

def filter_rows(filters):
    _,rows=workbook(); filters=filters or []
    if len(filters)>12:raise ValueError('Too many filters')
    for f in filters:field(f['field'])
    return [r for r in rows if all(matching(r,f) for f in filters)]

def valid(v):return v is not None and str(v).strip() not in ('','-','N/A','NA')

def analyze(field_code,filters=None,top=15,group_by=None):
    headers,_=workbook(); idx=field(field_code); selected=filter_rows(filters)
    def calc(rows):
        values=[str(r[idx]).strip() for r in rows if valid(r[idx])]
        c=collections.Counter(values); base=len(values)
        return {'respondents':len(rows),'valid_base':base,'missing_or_inapplicable':len(rows)-base,'results':[{'label':v,'count':n,'percent':round(n*100/base,2)} for v,n in c.most_common(max(1,min(int(top),50)))]}
    result={'field':headers[idx],'filters':filters or [],'unweighted':True}
    if group_by:
        gi=field(group_by); groups=collections.defaultdict(list)
        for r in selected:
            if valid(r[gi]):groups[str(r[gi]).strip()].append(r)
        result['group_by']=headers[gi]
        result['groups']=[{'group':g,**calc(rs)} for g,rs in sorted(groups.items(),key=lambda x:-len(x[1]))[:40]]
    else:result.update(calc(selected))
    return result

def multiselect(prefix,filters=None,top=20):
    """For checkbox questions represented as Q16_1...Q16_N, counts checked flags.
    The denominator is the filtered eligible base, excluding records where ALL flags are missing.
    """
    headers,_=workbook()
    # Models often pass "Q9_" while the workbook columns are Q9_1, Q9_2, ...
    # Remove a trailing separator before adding the one in the pattern.
    base=str(prefix).strip().strip('_')
    if base.casefold()=='q3':
        return {'error':'Q3 destinations are repeated response fields, not checkboxes.',
                'use_tool':'multi_response','field_codes':['Q3_1','Q3_2','Q3_3']}
    pattern=re.compile(r'^'+re.escape(base)+r'_(\d+)$',re.I)
    matches=[]
    for i,h in enumerate(headers):
        m=pattern.fullmatch(h.split(':',1)[0].strip())
        if m:matches.append((int(m.group(1)),i,h))
    if not matches:return {'error':'No checkbox fields found for '+base,'prefix_used':base}
    rows=filter_rows(filters)
    eligible=[r for r in rows if any(valid(r[i]) for _,i,_ in matches)]
    counts=[]
    for _,i,h in sorted(matches):
        c=sum(norm(r[i]) in ('yes','1','true','selected','checked') for r in eligible)
        label=h.split('(',1)[-1].rstrip(')') if '(' in h else h
        counts.append({'field':h.split(':',1)[0].strip(),'label':label,'count':c,'percent':round(100*c/len(eligible),2) if eligible else 0})
    return {'question_prefix':prefix,'filtered_respondents':len(rows),'valid_base':len(eligible),'multi_select':True,'unweighted':True,'results':sorted(counts,key=lambda x:-x['count'])[:max(1,min(int(top),50))]}

def multi_response(field_codes,filters=None,top=20):
    """Aggregate repeated text/choice response columns, counting each respondent once per answer."""
    if isinstance(field_codes,str):field_codes=[field_codes]
    if not isinstance(field_codes,list) or not field_codes or len(field_codes)>12:
        raise ValueError('Provide between 1 and 12 response field codes')
    headers,_=workbook()
    indexes=[field(code) for code in field_codes]
    rows=filter_rows(filters)
    counts=collections.Counter(); labels={}; eligible=0
    for row in rows:
        answers={}
        for index in indexes:
            value=row[index]
            if valid(value):
                label=re.sub(r'\s+',' ',str(value).strip())
                key=norm(label)
                if key:answers.setdefault(key,label)
        if answers:
            eligible+=1
            for key,label in answers.items():
                counts[key]+=1
                labels.setdefault(key,label)
    results=[{'label':labels[key],'count':count,'percent':round(count*100/eligible,2) if eligible else 0}
             for key,count in counts.most_common(max(1,min(int(top),50)))]
    return {'fields':[headers[index] for index in indexes],
            'filtered_respondents':len(rows),'valid_base':eligible,
            'multi_response':True,'unweighted':True,
            'denominator':'respondents with at least one valid response in the selected fields',
            'results':results}

def field_values(field_code,top=40):
    """List observed response options for one workbook field, with aggregated counts."""
    headers,rows=workbook(); index=field(field_code)
    counts=collections.Counter(str(row[index]).strip() for row in rows if valid(row[index]))
    base=sum(counts.values())
    return {'field':headers[index],'valid_base':base,'distinct_values':len(counts),
            'values':[{'value':value,'count':count,'percent':round(count*100/base,2) if base else 0}
                      for value,count in counts.most_common(max(1,min(int(top),100)))]}

def survey_profile():
    h,r=workbook()
    return {'respondents':len(r),'fields':len(h),'source_country':'QS0','preferred_airline':'Q14','preferred_hotel':'Q21','budget_change':'Q10','age':'QHIDAGE','budget_segment':'Segment_Budget','region_cluster':'QHIDCLUSTER','note':'Unweighted respondent data. Filter before aggregation.'}

def dashboard_json_catalog(query='',limit=20):
    """Locate dashboard JSON sources for corroboration; does not assume schema equivalence."""
    files=sorted((ROOT/'data').rglob('*.json'))
    q=str(query).strip().casefold()
    found=[p for p in files if q in p.name.casefold()]
    return {'matching_files':[str(p.relative_to(ROOT)) for p in found[:max(1,min(int(limit),30))]],'total_matches':len(found),'warning':'Dashboard JSON may use different periods, aggregations, and denominators; do not treat as interchangeable with master workbook.'}
