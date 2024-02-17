const express = require('express')
const https = require('https')
const path = require('path')
const ping = require ("net-ping");
const rl= require('readline')
const fs = require('fs')
const app = express()
const port = 4000
const ruproxies = __dirname +'/ruproxies.txt'
const ruproxiesjson = __dirname +'/ruproxies.json'
const ruproxiesfile = require(__dirname + '/ruproxies.json')

// web server 
app.use(express.static('.'));
app.get('/', (req, res) => res.sendFile(ruproxies))
app.get('/api', (req, res) => res.sendFile(ruproxiesjson))
app.set('views', path.join(__dirname, 'views'));
app.get("/visual", (req, res) => {
    res.render("ruproxies.ejs", { ruproxies: ruproxiesfile })
});
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
// web server
 

// getting US proxies every 30 seconds 
var timer = setInterval(()=>{

    // getting ip addrs
    var url = 'https://api.proxyscrape.com/?request=getproxies&proxytype=https&timeout=10000&country=RU&ssl=all&anonymity=all'
    
    // make request for ip addrs
    https.get(url, (res) => {

        addrs_data = ''

        res.on('data',(chunk)=>{
            addrs_data+=chunk       
        })
        res.on('end',()=>{
            console.log("--- New data recieved --- ")
            //write plain text to ip addrs
            fs.writeFile('ruproxies.txt',addrs_data,()=>{})

            // reading a 100 lines in in addrs_data
            data = addrs_data.split(/\r?\n/)
            var count = 0
            var fin_addrs = {}
            data.forEach(line => {
                ip_addrs = {}
                
                //add port to ip_addrs obj
                
                // console.log(count)
                let ip = line.split(':')[0]
                let port = line.split(':')[1]
                ip_addrs[count]= {}  
                ip_addrs[count]['port'] = port
                ip_addrs[count]['ip'] = ip

                //check for blank
                if(ip_addrs[count].ip === ''){
                    console.log('bitxh here '+ ip_addrs[count].ip)
                    delete ip_addrs[count]
                }else{
                    var num = 0
                    const url = `https://ipinfo.io/${ip_addrs[count].ip}/geo?token=c72404c7700c4d`
                    // make request to ipinfo
                    
                    https.get(url,(res)=>{
                        let p = ''
                        
                        res.on('data',(chunk)=>{
                            p+=chunk
                        })
                        res.on('end',()=>{
                            var d = new Date();
                            info = {}
                            info['ip'] = ip
                            info['port'] = port
                            info['city'] = JSON.parse(p).city
                            info['region'] = JSON.parse(p).region
                            info['country'] = JSON.parse(p).country
                            info['loc'] = JSON.parse(p).loc
                            info['postal'] = JSON.parse(p).postal
                            info['timezone'] = JSON.parse(p).timezone
                            info['status'] = true
                            info['ts'] = d.toLocaleString()
                                //check for status with ping
                                var session = ping.createSession();
                                session.pingHost(ip, function (error, target) {
                                    if (error)
                                    info['status'] = false
                                    else
                                    info['status'] = true
                                });
                            fin_addrs[count] = info
                            fs.writeFile('ruproxies.json',JSON.stringify(fin_addrs,"/t",4),()=>{});
                            // console.log(fin_addrs)
                            // console.log(fin_addrs)
                            count++
                            //write to json  
                            
                            
                        })
                       
                    })
                   
                }
                
                
                   
            
            }) 
            
            // fs.appendFile('ruproxies.json',JSON.stringify(fin_addrs,"/t",4),()=>{});
                
           
        
        });

        
        

    



    })
    
    



//clear ruproxies files
fs.writeFile('ruproxies.txt','--- Refreshed day ---',()=>{})
// fs.writeFile('ruproxies.json','',()=>{})
},86400000)//86400000





