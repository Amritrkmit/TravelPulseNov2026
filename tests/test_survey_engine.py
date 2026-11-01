import sys,unittest
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from survey_engine import analyze,multiselect,survey_profile,search_fields,dashboard_json_catalog
class SurveyEngineTests(unittest.TestCase):
 def test_profile(self):
  self.assertEqual(survey_profile()['respondents'],1417)
 def test_india_airline(self):
  a=analyze('Q14',[{'field':'QS0','value':'India'}]);self.assertEqual(a['valid_base'],104);self.assertEqual(a['results'][0]['label'],'Air India');self.assertEqual(a['results'][0]['count'],29)
 def test_uae_alias(self):
  a=analyze('Q14',[{'field':'QS0','value':'UAE'}]);self.assertEqual(a['valid_base'],53);self.assertEqual(a['results'][0]['count'],36)
 def test_comparison(self):
  a=analyze('Q14',[{'field':'QS0','values':['India','UAE']}],group_by='QS0');self.assertEqual(len(a['groups']),2)
 def test_hotels(self):
  self.assertGreater(analyze('Q21')['valid_base'],0)
 def test_budget(self):
  self.assertGreater(analyze('Q10',[{'field':'QS0','value':'India'}])['valid_base'],0)
 def test_multiselect(self):
  self.assertEqual(multiselect('Q16',[{'field':'QS0','value':'India'}])['valid_base'],104)
 def test_search(self):
  self.assertGreater(search_fields('preferred accommodation')['matches'],0)
 def test_json_catalog(self):
  self.assertGreater(dashboard_json_catalog('dest-india')['total_matches'],0)
if __name__=='__main__':unittest.main()
