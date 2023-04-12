# Cermati-SDET-Assignment
Scenario 2: Access a Product via Search

to run api file use "npx mocha ".
User Chai Mocha framework

Approach:- 
1. Automation Search API of Ebay and creating utility fuction of it
2. Utilizing the function in validating TC 
3. Validation the API HTML responce to search title page ang nav bar
5. Verifying tiltle as <title> MacBook in Computers/Tablets &amp; Networking for sale | eBay</title>

Curl to be verified : - 


curl 'https://www.ebay.com/sch/i.html?_from=R40&_trksid=p2380057.m570.l1313&_nkw=MacBook&_sacat=58058' \
  -H 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7' \
  -H 'Accept-Language: en-GB,en-US;q=0.9,en;q=0.8' \
  -H 'Connection: keep-alive' \
  -H 'Cookie: ak_bmsc=46D4F8E0AF64CF7CE24E4BED48B8ACD0~000000000000000000000000000000~YAAQByozag6CpXGHAQAAoYv/dRO3K5AhR2qH7h9h6kIJtwV83jVDj17ahKpXa95NCG+aOwZm9kvPlbNZJ3GKNtAlaoLwUKBWZob073fSJo9DXBtk5ouz0m1EqE7LE7t5R/ZpJLmft7u5k2yk0pIavWFbZGfCOqsjf/2ztTIBmyp5c2CV+kb2Cm+9DS1qfjLANh+9xtin4p7AxWt02j7Ikh+ReKsl5SqP/zkAsJrFNCIjRGFfUdPOXYYeZW4U4THWbQYz2clqkpWAgF9owsHwOrKNxhiJI1yNgTCFbkP7kztgECRwg9z5PoHhJG7n54bOapDPKanxfgiY0UMxnRBOkw3xHs26FK4HwYfjEg+aKnyq4LqeSfgmh17yNg==; __ssds=2; __uzma=c2983e93-08da-4e43-a4ca-e5ac8a058e05; __uzmb=1681311895; __uzme=7061; __ssuzjsr2=a9be0cd8e; __uzmaj2=0167d5e0-52a0-4b9a-a648-bd55f8beb57f; __uzmbj2=1681311895; __uzmc=222971611414; __uzmd=1681311968; __uzmf=7f600062b83eaf-d426-4c6c-a97a-15e1c47ac34e168131189534372784-a0c914d50cd8d2fa16; __gads=ID=de33f6080e1a5d04:T=1681311971:S=ALNI_MZbx2iIX7PraAI1OMzxeEsfurMIOg; __gpi=UID=00000bf3f2b10107:T=1681311971:RT=1681311971:S=ALNI_MbrPbBt9jJ1ppwBQfUHg63Ft7TEAQ; bm_sv=92CC1B7B113080CD40632ACD85107E34~YAAQByozajEGpnGHAQAAC+UGdhNpo1it/5Sr6w3ZmrTE5SyLMlXc2KSzEQ/ep0mFRs/cGmwUvkSqwEaCqgzkBu9wR143V0fEtrmBAsePFPLRofzbacXMz5gx4CXifskWYis3GAlksYbHyShEnP9dBhPGcoavwxlCAXuGMm77Pwf/h0Pbjc0bEAj9wswGwnZCMj+HP1xoAPns2ZNdgisJn70Pdv52Tz5j9YI/9aFLpI8qZHHm1QKROjrszI48E9M=~1; __uzmcj2=729503496208; __uzmdj2=1681312377; s=CgAD4ACBkOBqENzVmZjhhZjAxODcwYTBhNzk1YzVkOTkyZmZmZmUxYzB0H+zH; ns1=BAQAAAYZC69hsAAaAANgAU2YX/fljNjl8NjAxXjE2ODEzMTE5NjgyNTVeXjFeM3wyfDV8NHw3fDEwfDQyfDQzfDExXl5eNF4zXjEyXjEyXjJeMV4xXjBeMV4wXjFeNjQ0MjQ1OTA3NRoSrvhlmnG3fDJvueSiu6kvhUBL; dp1=bu1p/QEBfX0BAX19AQA**67f93179^pbf/%23e000e000000000000000006617fdf9^bl/IN67f93179^; nonsession=BAQAAAYZC69hsAAaAADMABmYX/fk1NjAwMDEAygAgZ/kxeTc1ZmY4YWYwMTg3MGEwYTc5NWM1ZDk5MmZmZmZlMWMwAMsAAmQ20YEyNXpRIdGdW2lFzJzbmMdrQJKe6WnN; __deba=JX_g7FYCkir5UtGFoBU2aGELRi1p7sAZeNM_c9CqchuXBQ-CQez7WLsqiioUftpnXR8UW1J2_XMwSXzXGqPFGPIeLGjSzXKU0CFO7wN951OIMK_beCPjoBgrjOqnGVP7XDky0Ny5gh_oMT9k4M_btg==; ebay=%5Ejs%3D1%5Esbf%3D%23000000%5Epsi%3DABt5SmeY*%5E; ds2=sotr/b9TxWzzzzzzz^' \
  -H 'Referer: https://www.ebay.com/' \
  -H 'Sec-Fetch-Dest: document' \
  -H 'Sec-Fetch-Mode: navigate' \
  -H 'Sec-Fetch-Site: same-origin' \
  -H 'Sec-Fetch-User: ?1' \
  -H 'Upgrade-Insecure-Requests: 1' \
  -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36' \
  -H 'sec-ch-ua: "Google Chrome";v="111", "Not(A:Brand";v="8", "Chromium";v="111"' \
  -H 'sec-ch-ua-full-version: "111.0.5563.64"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'sec-ch-ua-model: ""' \
  -H 'sec-ch-ua-platform: "macOS"' \
  -H 'sec-ch-ua-platform-version: "12.6.0"' \
  --compressed
