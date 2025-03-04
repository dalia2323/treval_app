import axios from "axios";
const form= document.querySelector("form");
const dateInp=document.querySelector("#date");




const handleSubmit=async(e)=>{
    e.preventDefault();
    const Location=await getCity();
    const {name,lang,lat}=location
    const date=dateInp.value;
    const Rdays=getRdays()
    const getWeather=getWeather(lang,lat,Rdays)
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
}
export{handleSubmit}