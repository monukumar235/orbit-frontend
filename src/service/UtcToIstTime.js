

const getTimeInISt = (utcTime)=>{
    const date = new Date(utcTime);
    if(!utcTime){
      return;
    }
    return date.toLocaleString("en-IN",{
      timeZone : "Asia/kolkata",
      hour : "2-digit",
      minute : "2-digit",
      second : "2-digit",
      hour12 : true
    });
  };

  export default getTimeInISt;