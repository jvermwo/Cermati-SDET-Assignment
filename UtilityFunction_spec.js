const supertest = require("supertest")
const config = require('./config').config;
const baseURL = supertest(config.baseURL);

var UtilityFunction = function () {
    
    this.ebaySearchAPI = async function () {
        return baseURL.get("/sch/i.html?_from=R40&_trksid=p2380057.m570.l1313&_nkw=MacBook&_sacat=58058m")
            .set("Accept", text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7)
            .set("Accept-Language",en-GB,en-US;q=0.9,en;q=0.8)
            .set("Connection",keep-alive)
            .set("Referer",https://www.ebay.com/)
            .set("Sec-Fetch-Dest",document)
            .set("User-Agent",Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36)
            .then(function (response) {
                if (response.status == 200) {
                    return {
                        "success": true,
                        "body": response.body
                    }
                } else {
                    return {
                        "success": false,
                        "body": response.body
                    }
                }
            })
    }
    
       
}
module.exports = new UtilityFunction();
