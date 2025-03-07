import axios from "axios";
const form= document.querySelector("form");
const dateInp=document.querySelector("#date");




const handleSubmit=async(e)=>{
    e.preventDefault();
    const Location=await getCity();
    const {name,lang,lat}=location
    const date=dateInp.value;
    const Rdays=getRdays()
    const getWeather=await getWeather(lang,lat,Rdays)
    const {image}=getCityPic(name)
    upadteUI(Rdays,name,image,getWeather)
}
const getCity=async()=>{
    const {data}=await axios.post("http://localhost:8000/getCity",form,{
        headers:{
            "Content-Type": "application/json",
        }
    });
    return data
}
getRdays=(date)=>{
    const now=new Date()
    const travelDate=new Date(date)
    const timeDifference=travelDate.getTime()- now.getTime()
    const Rdays=Math.ceil(timeDifference/ (1000*3600*24))
    return Rdays
}
const getWeather=async(lang,lat,Rdays)=>{
    const {data}=await axios.post("http://localhost:8000/getWeather",{
lat,
lang,
Rdays
    },
    );
    return data
}
const getCityPic=async (name)=>{
   const {data}=await axios.post("http://localhost:8000/getPic",{
        name
    },
)
return data
}
const upadteUI=(Rdays,city,pic,weather)=>{
    document.querySelector("#Rdays").innerHTML=`
    your trip starts in ${Rdays} days from now `;
    document.querySelector(".cityName").innerHTML=`Location ${city}`;
    document.querySelector(".weather").innerHTML=
    Rdays<7
    ?`weather is ${weather.description}`
    :`weather is expected to be :${weather.description}` ;
    document.querySelector(".temp").innerHTML=
    Rdays<7
    ?`Forecast: ${weather.temp}&deg C`
    :`temperature: ${weather.temp}&deg C`;
    //
    document.querySelector(".max-temp").innerHTML=
    Rdays>7 ?`Max-temp :${weather.app_max_temp}&deg C`:"";
    document.querySelector(".min-temp").innerHTML=
    Rdays>7 ?`Min-temp :${weather.app_min_temp}&deg C`:"";
    document.querySelector(".pic").innerHTML=
    `<img src="${Picture}" alt="city pic">`;
    document.querySelector(".flight_data").style.display="block";
    
};
export{handleSubmit}