# Scholarship Fetch Results

## Summary

- **Total universities:** 91
- **Successfully fetched:** 38 universities (42%)
- **Failed to fetch:** 53 universities (58%)

## Successful Fetches

| University | Domain | Announcements |
|------------|--------|---------------|
| home.knu.ac.kr | https://home.knu.ac.kr/HOME/knussw/sub.htm?nav_code=knu1619417559 | 4 |
| nsu.ac.kr | https://nsu.ac.kr/?m1=page&menu_id=134 | 39 |
| onestop.pusan.ac.kr | https://onestop.pusan.ac.kr/page?menuCD=000000000000070 | 21 |
| sgu.ac.kr | https://sgu.ac.kr/ko/campus/scholarship-info.php | 57 |
| web.kangnam.ac.kr | https://web.kangnam.ac.kr/menu/062e41fba927c0c76d1c0e929f931016.do | 41 |
| www.anyang.ac.kr | https://www.anyang.ac.kr/main/academic/gyroenterology.do | 30 |
| www.bible.ac.kr | https://www.bible.ac.kr/ko/life/tuition_rule | 21 |
| www.calvin.ac.kr | http://www.calvin.ac.kr/main/contentsInfo.do?brd_mgrno=0&menu_no=2272 | 16 |
| www.catholic.ac.kr | https://www.catholic.ac.kr/ko/support/scholarship_songsim.do | 10 |
| www.cs.ac.kr | https://www.cs.ac.kr/document/life2_3 | 46 |
| www.daejin.ac.kr | https://www.daejin.ac.kr/daejin/2899/subview.do | 3 |
| www.dhu.ac.kr | https://www.dhu.ac.kr/pages/sub.htm?nav_code=dhu1572851543 | 56 |
| www.dju.ac.kr | https://www.dju.ac.kr/dju/cm/cntnts/cntntsView.do?mi=1172&cntntsId=1064 | 95 |
| www.duksung.ac.kr | https://www.duksung.ac.kr/contents/contents.do?ciIdx=205&menuId=1141 | 22 |
| www.hanbat.ac.kr | https://www.hanbat.ac.kr/kor/sub05_090101.do | 10 |
| www.hywoman.ac.kr | https://www.hywoman.ac.kr/ko/cms/FrCon/index.do?MENU_ID=780 | 58 |
| www.kmu.ac.kr | https://www.kmu.ac.kr/uni/main/page.jsp?mnu_uid=3347 | 4 |
| www.knsu.ac.kr | https://www.knsu.ac.kr/knsu/unilife/scholarship-information.do | 6 |
| www.kongju.ac.kr | https://www.kongju.ac.kr/KNU/16842/subview.do | 44 |
| www.koreatech.ac.kr | https://www.koreatech.ac.kr/menu.es?mid=a10609010200 | 1 |
| www.kunsan.ac.kr | https://www.kunsan.ac.kr/kunsan/241/subview.do | 7 |
| www.kwu.ac.kr | https://www.kwu.ac.kr/mod/page/view.do?MID=KWU_C04070101 | 45 |
| www.mokwon.ac.kr | https://www.mokwon.ac.kr/kr/html/sub04/040101.html | 12 |
| www.pcu.ac.kr | https://www.pcu.ac.kr/kor/contents/33 | 55 |
| www.ptu.ac.kr | https://www.ptu.ac.kr/www/659/subview.do | 31 |
| www.scu.ac.kr | https://www.scu.ac.kr/univ/scholarkind_2018 | 44 |
| www.semyung.ac.kr | https://www.semyung.ac.kr/kor/sub04_04_01.do | 42 |
| www.seowon.ac.kr | https://www.seowon.ac.kr/seowon/655/subview.do | 59 |
| www.shyu.ac.kr | https://www.shyu.ac.kr/fro_end/html/dep_03/3120.php | 2 |
| www.sjs.ac.kr | https://www.sjs.ac.kr/ht_ml/w_03ed/3250.php | 25 |
| www.skuniv.ac.kr | https://www.skuniv.ac.kr/internal-scholarships | 19 |
| www.smu.ac.kr | https://www.smu.ac.kr/kor/life/payment.do | 17 |
| www.snue.ac.kr | https://www.snue.ac.kr/snue/cm/cntnts/cntntsView.do?mi=3002&cntntsId=1189 | 17 |
| www.suwon.ac.kr | https://www.suwon.ac.kr/index.html?menuno=883 | 20 |
| www.syu.ac.kr | https://www.syu.ac.kr/academic/scholarship-information/scholarships/ | 119 |
| www.ut.ac.kr | https://www.ut.ac.kr/kor/sub06_05_01.do | 7 |
| www.yongin.ac.kr | https://www.yongin.ac.kr/cmn/sym/mnu/mpm/105040100/htmlMenuView.do | 90 |
| wwwk.kangwon.ac.kr | https://wwwk.kangwon.ac.kr/www/selectTnSchlshipListU.do?key=2371 | 7 |

## Common Issues with Failed Fetches

1. **404 Errors:** Many URLs in the source document are no longer valid
2. **JavaScript-heavy sites:** Some universities use SPAs that require specific JavaScript execution
3. **Authentication required:** Some scholarship boards require login
4. **Rate limiting:** Some sites block automated access
5. **Dynamic content:** Some sites load content via AJAX that requires specific handling

## Next Steps for Improvement

1. Update URLs in the source document (docs/0003-korean-universities-scholarship-boards.md)
2. Add custom selectors for each university's specific board structure
3. Implement retry logic with exponential backoff
4. Add proxy support for rate-limited sites
5. Create manual fallback for sites that require authentication
