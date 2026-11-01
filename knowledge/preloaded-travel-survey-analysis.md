# Preloaded Travel Survey Analysis Reference

Source: `01Oct2026_Travel Pulse_Escalent_Dataset_1417 Completes with Segments (1).xlsx` / Sheet1. Generated from the fixed master dataset for quick answering. All figures are unweighted because no survey weight field was identified in the workbook profile.

## Dataset Profile
- Respondent records: 1,417
- Fields/columns: 1,516
- Key segment fields: `QHIDCLUSTER`, `QHIDAGE`, `Segment_Age`, `Segment_Budget`, traveler-type flags, `Q6a`, `Q10`, `Q11`, airline and hotel brand/recommendation fields.

### Core Segment Counts
**Country**
- China: 108 (7.6%)
- India: 104 (7.3%)
- United Kingdom: 104 (7.3%)
- United States of America: 100 (7.1%)
- France: 55 (3.9%)
- Germany: 54 (3.8%)
- Italy: 53 (3.7%)
- United Arab Emirates: 53 (3.7%)
- South Africa: 51 (3.6%)
- Saudi Arabia: 51 (3.6%)
- Australia: 50 (3.5%)
- Spain: 50 (3.5%)

**Region cluster**
- Europe: France, Germany, Netherlands, Switzerland, UK, Italy, Spain, Russia, Ireland: 437 (30.8%)
- Middle East: Bahrain, Qatar, Saudi Arabia, UAE, Jordan, Egypt, Turkey: 258 (18.2%)
- Southeast Asia and Pacific: Indonesia, Malaysia, Philippines, Singapore, Thailand, Australia: 173 (12.2%)
- East Asia and Pacific: China, Japan, South Korea: 170 (12.0%)
- Americas: US, Canada, Brazil: 160 (11.3%)
- Africa: Nigeria, Kenya, South Africa: 115 (8.1%)
- South Asia: India: 104 (7.3%)

**Age group**
- 25-34: 449 (31.7%)
- 35-44: 424 (29.9%)
- 45-54: 196 (13.8%)
- 55-65: 134 (9.5%)
- 18-24: 128 (9.0%)
- 65+: 86 (6.1%)

**Budget segment**
- Budget Travelers: 931 (65.7%)
- Premium Travelers: 413 (29.1%)
- Luxury Travelers: 73 (5.2%)

**Trip timing**
- 1–3 months from now: 673 (47.5%)
- 4–6 months from now: 498 (35.1%)
- 7–9 months from now: 166 (11.7%)
- 10–12 months from now: 63 (4.4%)
- Can’t say: 17 (1.2%)

**Budget change**
- Will increase slightly (up to 10%): 426 (30.1%)
- Will increase moderately (10–30%): 414 (29.2%)
- Will remain the same: 297 (21.0%)
- Will increase significantly (more than 30%): 182 (12.8%)
- Will decrease slightly (up to 10%): 56 (4.0%)
- Will decrease moderately (10–30%): 20 (1.4%)
- Can’t say: 20 (1.4%)
- Will decrease significantly (more than 30%): 2 (0.1%)

**Hotel class**
- ECONOMY: 968 (68.3%)
- LUXURY: 415 (29.3%)

## Default Analysis Results

### 1. 25–34-year-old leisure travelers in Asia expecting travel budget decrease
- Base: 105 respondents (25–34, leisure traveler, Asia cluster).
- Expect budget to decrease: 2 respondents (1.9%).
- Definition used: Asia = QHIDCLUSTER containing East Asia, Southeast Asia/Pacific, or South Asia; leisure = Traveler Type (TT_LEISURE) = Yes; decrease = Q10 response starts with “Will decrease”.

### 2. Budget change: Asia vs Europe
**Asia base: 447**
- Will increase moderately (10–30%): 146 (32.7%)
- Will increase slightly (up to 10%): 138 (30.9%)
- Will remain the same: 80 (17.9%)
- Will increase significantly (more than 30%): 58 (13.0%)
- Will decrease slightly (up to 10%): 15 (3.4%)
- Will decrease moderately (10–30%): 8 (1.8%)
- Can’t say: 2 (0.4%)
- Any decrease: 23 (5.1%); any increase: 342 (76.5%); same: 80 (17.9%).

**Europe base: 437**
- Will remain the same: 145 (33.2%)
- Will increase slightly (up to 10%): 122 (27.9%)
- Will increase moderately (10–30%): 86 (19.7%)
- Will increase significantly (more than 30%): 35 (8.0%)
- Will decrease slightly (up to 10%): 25 (5.7%)
- Can’t say: 16 (3.7%)
- Will decrease moderately (10–30%): 7 (1.6%)
- Will decrease significantly (more than 30%): 1 (0.2%)
- Any decrease: 33 (7.6%); any increase: 243 (55.6%); same: 145 (33.2%).

### 3. Destination decision considerations among 25–34-year-old travelers
- Base: 449 respondents age 25–34. The workbook has destination consideration variables, not an explicit “changed destination choices” flag; use this as the closest precomputed evidence unless the user asks for a different mapping.
- Safe and secure destination: 124/449 (27.6%)
- Relaxing/enjoyable trip: 87/358 (24.3%)
- Experiences sought: 87/358 (24.3%)
- Positive reviews/social media: 100/449 (22.3%)
- Comfort with culture/language: 92/449 (20.5%)
- Flexible booking/cancellation: 86/449 (19.2%)
- Good value for money: 67/358 (18.7%)
- Manageable travel time: 82/449 (18.3%)
- Companions comfortable: 62/358 (17.3%)
- Confident planning logistics: 72/449 (16.0%)

### 4. Airline selection considerations among Europe-based travelers
- Base: 437 Europe-cluster respondents. The workbook has airline selection considerations, not an explicit “changed airline preference” flag; use this as the closest precomputed evidence unless the user asks for a different mapping.
- Price / value for money: 176/437 (40.3%)
- Safety & security: 126/437 (28.8%)
- Reliability: 119/437 (27.2%)
- Service quality: 101/437 (23.1%)
- Familiarity with airline: 96/437 (22.0%)
- Ease of booking/managing trip: 80/437 (18.3%)
- Loyalty program: 68/437 (15.6%)
- Cabin comfort/onboard experience: 62/437 (14.2%)
- Connectivity: 58/437 (13.3%)
- Modern fleet: 42/437 (9.6%)

### 5. Hotel brands with strongest positive sentiment among Luxury Travelers
- Base: 73 Luxury Travelers (`Segment_Budget = Luxury Travelers`). Positive sentiment = Q21a recommendation score 8–10. Rank below uses brands with at least 5 valid luxury-traveler ratings.
- Hilton: 24/24 positive (100.0%); luxury base for brand: 24
- Marriott International: 13/13 positive (100.0%); luxury base for brand: 13
- Hyatt Hotels: 6/6 positive (100.0%); luxury base for brand: 6

### 6. Europe age 25–44 planning international travel in next 6 months: budget-reduction risk and implications
- Base: 179 respondents (Europe cluster, age 25–44, trip timing in 1–3 or 4–6 months).
- Expect budget to decrease: 9/179 (5.0%).
**Segments most likely to reduce budget**
- Country: Ireland: 2/11 (18.2%)
- Age 25-34: 6/71 (8.5%)
- Budget segment: Budget Travelers: 8/109 (7.3%)
- Country: Switzerland: 1/17 (5.9%)
- Traveler type: Leisure: 7/129 (5.4%)
- Traveler type: Business: 2/38 (5.3%)
- Country: Spain: 1/19 (5.3%)
- Country: United Kingdom: 3/63 (4.8%)
- Age 35-44: 3/108 (2.8%)
- Budget segment: Premium Travelers: 1/54 (1.9%)
- Budget segment: Luxury Travelers: 0/16 (0.0%)
- Country: Germany: 0/30 (0.0%)
**How reducers intend to manage the reduction**
- Choose lower-cost flights: 3/9 (33.3%)
- Be flexible with travel dates: 3/9 (33.3%)
- Choose more budget-friendly destinations or activities: 2/9 (22.2%)
- Choose lower-cost accommodation: 2/9 (22.2%)
- Spend less on shopping/dining/activities: 2/9 (22.2%)
- Combine trips/destinations: 2/9 (22.2%)
- Reduce number of trips: 1/9 (11.1%)
- Take shorter trips: 1/9 (11.1%)
- Travel during off-peak seasons: 1/9 (11.1%)
- Book further in advance: 1/9 (11.1%)
**Destination implications among reducers: most considered destinations**
- United Kingdom: 3 mentions across up to three considered-destination fields
- Hungary: 1 mentions across up to three considered-destination fields
- United States: 1 mentions across up to three considered-destination fields
- Singapore: 1 mentions across up to three considered-destination fields
- Malaysia: 1 mentions across up to three considered-destination fields
- France: 1 mentions across up to three considered-destination fields
- Morocco: 1 mentions across up to three considered-destination fields
- Spain: 1 mentions across up to three considered-destination fields
- Italy: 1 mentions across up to three considered-destination fields
- Slovakia: 1 mentions across up to three considered-destination fields
**Airline implications among reducers: most likely airline carrier**
- Ryanair: 3
- Others (Please specify): 2
- Swiss: 1
- British Airways: 1
- Aer Lingus: 1
- Air France: 1

## Fast-Answer Field Map
- `country` → column 4: QS0 : QS0. In which country do you currently reside (spend more than 9 months in a year)?
- `region` → column 5: QHIDREGION : QHIDREGION
- `cluster` → column 6: QHIDCLUSTER : QHIDCLUSTER
- `segment_age` → column 8: Segment_Age
- `segment_budget` → column 9: Segment_Budget
- `age` → column 11: QHIDAGE : QHIDAGE. Hidden Question for code age group
- `gender` → column 12: QS2 : QS2. What is your gender?
- `income_bracket` → column 18: QS11 : QS11 Which of the following best describes your net monthly household income Bracket
- `q6a_when` → column 64: Q6a : Q6a. When do you expect to / will you take this trip
- `trav_leisure` → column 46: Traveler Type (TT_LEISURE )
- `trav_business` → column 47: Traveler Type (TT_BUSINESS)
- `trav_bleisure` → column 48: Traveler Type (TT_BLEISURE)
- `q10_budget_change` → column 143: Q10 : Q10.Compared to your spending in the past 12 months, how do you expect your
- `q11_budget_dest` → column 144: Q11_1 : Q11. How are you likely to manage a reduction in your travel spending in the next 12 months?  (Choose more budget-friendly destinations or activities)
- `q11_reduce_trips` → column 145: Q11_2 : Q11. How are you likely to manage a reduction in your travel spending in the next 12 months?  (Reduce the number of trips taken)
- `q11_shorter` → column 146: Q11_3 : Q11. How are you likely to manage a reduction in your travel spending in the next 12 months?  (Take shorter trips)
- `q11_domestic` → column 147: Q11_4 : Q11. How are you likely to manage a reduction in your travel spending in the next 12 months?  (Choose domestic travel instead of international travel)
- `q11_low_cost_flights` → column 148: Q11_5 : Q11. How are you likely to manage a reduction in your travel spending in the next 12 months?  (Choose lower-cost flights (e.g., indirect routes))
- `q11_lower_cabin` → column 149: Q11_6 : Q11. How are you likely to manage a reduction in your travel spending in the next 12 months?  (Fly in a lower cabin class)
- `q11_lower_accom` → column 150: Q11_7 : Q11. How are you likely to manage a reduction in your travel spending in the next 12 months?  (Choose lower-cost accommodation)
- `q11_less_activities` → column 151: Q11_8 : Q11. How are you likely to manage a reduction in your travel spending in the next 12 months?  (Spend less on shopping, dining and activities during the trip)
- `q11_all_inclusive` → column 152: Q11_9 : Q11. How are you likely to manage a reduction in your travel spending in the next 12 months?  (Choose all-inclusive packages to better manage costs)
- `q11_off_peak` → column 153: Q11_10 : Q11. How are you likely to manage a reduction in your travel spending in the next 12 months?  (Travel during off-peak seasons)
- `q11_advance` → column 154: Q11_11 : Q11. How are you likely to manage a reduction in your travel spending in the next 12 months?  (Book further in advance to secure lower prices)
- `q11_flexible_dates` → column 155: Q11_12 : Q11. How are you likely to manage a reduction in your travel spending in the next 12 months?  (Be more flexible with my travel dates to find better deals)
- `q11_share_costs` → column 156: Q11_13 : Q11. How are you likely to manage a reduction in your travel spending in the next 12 months?  (Travel with others to share costs)
- `q11_trusted_dest` → column 157: Q11_14 : Q11. How are you likely to manage a reduction in your travel spending in the next 12 months?  (Choose destinations recommended by people I trust to reduce planning risk)
- `q11_promos` → column 158: Q11_15 : Q11. How are you likely to manage a reduction in your travel spending in the next 12 months?  (Wait for promotions or special offers before booking)
- `q11_combine` → column 159: Q11_16 : Q11. How are you likely to manage a reduction in your travel spending in the next 12 months?  (Combine multiple trips or destinations into a single, longer trip)
- `q9_safe` → column 94: Q9_1 : Q9. Which are the key considerations that would influence / influenced your decision making for this next trip?  (I believe the destination is safe and secure)
- `q9_free_disrupt` → column 95: Q9_2 : Q9. Which are the key considerations that would influence / influenced your decision making for this next trip?  (I believe the trip would be free of disruptions (e.g., cancellations or rerouting))
- `q9_logistics` → column 96: Q9_3 : Q9. Which are the key considerations that would influence / influenced your decision making for this next trip?  (I feel confident in planning the logistics of this trip)
- `q9_visa` → column 97: Q9_4 : Q9. Which are the key considerations that would influence / influenced your decision making for this next trip?  (I would know how to navigate the visa and entry requirements)
- `q9_culture` → column 98: Q9_5 : Q9. Which are the key considerations that would influence / influenced your decision making for this next trip?  (I feel comfortable with the culture, local customs or language of this destination)
- `q9_travel_time` → column 99: Q9_6 : Q9. Which are the key considerations that would influence / influenced your decision making for this next trip?  (The travel time and journey are manageable for me)
- `q9_flights` → column 100: Q9_7 : Q9. Which are the key considerations that would influence / influenced your decision making for this next trip?  (There are convenient flight options available)
- `q9_flexible` → column 101: Q9_8 : Q9. Which are the key considerations that would influence / influenced your decision making for this next trip?  (Flexible booking or cancellation options are available)
- `q9_reviews` → column 102: Q9_9 : Q9. Which are the key considerations that would influence / influenced your decision making for this next trip?  (Positive reviews or social media content about the destination)
- `q9_relaxing` → column 103: Q9_10 : Q9. Which are the key considerations that would influence / influenced your decision making for this next trip?  (I expect a relaxing and enjoyable trip)
- `q9_experiences` → column 104: Q9_11 : Q9. Which are the key considerations that would influence / influenced your decision making for this next trip?  (The destination offers the experiences I am looking for)
- `q9_value` → column 105: Q9_12 : Q9. Which are the key considerations that would influence / influenced your decision making for this next trip?  (The trip offers a good value for money)
- `q9_companions` → column 106: Q9_13 : Q9. Which are the key considerations that would influence / influenced your decision making for this next trip?  (My travel companions are comfortable with this destination)
- `q9_recommend` → column 107: Q9_14 : Q9. Which are the key considerations that would influence / influenced your decision making for this next trip?  (Friends, family or people I trust recommend this destination)
- `q16_price` → column 203: Q16_1 : Q16. For this next trip for, what would be / were your key considerations while selecting an airline carrier? (Price / Value for money)
- `q16_safety` → column 204: Q16_2 : Q16. For this next trip for, what would be / were your key considerations while selecting an airline carrier? (Safety & security)
- `q16_connectivity` → column 205: Q16_3 : Q16. For this next trip for, what would be / were your key considerations while selecting an airline carrier? (Connectivity)
- `q16_loyalty` → column 206: Q16_4 : Q16. For this next trip for, what would be / were your key considerations while selecting an airline carrier? (Loyalty Program)
- `q16_reviews` → column 207: Q16_5 : Q16. For this next trip for, what would be / were your key considerations while selecting an airline carrier? (Positive reviews / recommendations)
- `q16_comfort` → column 208: Q16_6 : Q16. For this next trip for, what would be / were your key considerations while selecting an airline carrier? (Cabin comfort and onboard experience)
- `q16_reliability` → column 209: Q16_7 : Q16. For this next trip for, what would be / were your key considerations while selecting an airline carrier? (Reliability)
- `q16_service` → column 210: Q16_8 : Q16. For this next trip for, what would be / were your key considerations while selecting an airline carrier? (Service Quality)
- `q16_fleet` → column 211: Q16_9 : Q16. For this next trip for, what would be / were your key considerations while selecting an airline carrier? (Modern Fleet)
- `q16_amenities` → column 212: Q16_10 : Q16. For this next trip for, what would be / were your key considerations while selecting an airline carrier? (Flight Amenities)
- `q16_crew` → column 213: Q16_11 : Q16. For this next trip for, what would be / were your key considerations while selecting an airline carrier? (Cabin Crew’s Competence)
- `q16_familiarity` → column 214: Q16_12 : Q16. For this next trip for, what would be / were your key considerations while selecting an airline carrier? (Familiarity with the airline)
- `q16_booking` → column 215: Q16_13 : Q16. For this next trip for, what would be / were your key considerations while selecting an airline carrier? (Ease of booking and managing the trip)
- `q16_website` → column 216: Q16_14 : Q16. For this next trip for, what would be / were your key considerations while selecting an airline carrier? (Confidence navigating the airline's website/app)
- `q16_flex` → column 217: Q16_15 : Q16. For this next trip for, what would be / were your key considerations while selecting an airline carrier? (Flexible booking, cancellation or refund options)
- `q16_lounge` → column 218: Q16_16 : Q16. For this next trip for, what would be / were your key considerations while selecting an airline carrier? (Access to lounge )
- `q21_brand` → column 1143: Q21 : Q21. Which would / is be your most preferred accommodation brand that you would use / are using for this next international trip?
- `q21a_recommend` → column 1145: Q21a : Q21a. How likely are you to recommend ^f('Q21').get() == '98' ? f('Q21_98_other') : f('Q21')^ to others?
- `hotel_class` → column 1142: HOTEL_CLASS : HOTEL_CLASS
- `airline_class_lux` → column 201: AIRLINE_CLASS_LUXURY : AIRLINE_CLASS_LUXURY
- `q3_1` → column 54: Q3_1 : Q3.  Please mention the international destinations you considered / will consider visiting in the next 12 months for this trip?
- `q3_2` → column 55: Q3_2 : Q3.  Please mention the international destinations you considered / will consider visiting in the next 12 months for this trip?
- `q3_3` → column 56: Q3_3 : Q3.  Please mention the international destinations you considered / will consider visiting in the next 12 months for this trip?
- `q14_airline` → column 196: Q14 : Q14. Which airline carrier would you most likely use / are using for this next international trip?
- `q19_accom` → column 1139: Q19 : Q19. Which accommodation would you most likely use / are using for this next international trip?

## Use Guidance
- Use this file first for routine questions about default analyses, segment counts, common distributions, field mappings, and precomputed toplines.
- If a user asks for a result not covered here, compute it from the master workbook and cite the fields/filters used.
- If a user asks about “changed destination choices” or “changing airline preferences,” note that the workbook contains consideration/preference variables rather than an explicit change flag unless another field is identified in the raw workbook.
- Treat all values in this reference as unweighted. If a weight field is later identified, recalculate rather than relying on these unweighted precomputations.
