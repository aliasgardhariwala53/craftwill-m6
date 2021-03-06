export const  shareItemsHandler=(sharesObj,id,shareNewObj,type) =>{
    const myItem = shareNewObj?.findIndex((el) => el.member === id);

    if(myItem === -1) {
      shareNewObj.push({
        member: id,
        share: sharesObj[0]?.share || 0,
        type,
      })
    }
    else {
        return shareNewObj=shareNewObj.filter((el)=>el.member !==id )  
    }  
    return shareNewObj;
}

export const splitHandlerCall=(arr)=>{
  const totalShare = arr?.map((el)=>Number(el.share) || 0).reduce((prev,curr)=>prev+curr,0);
  const count = arr.length;
   const dividedValue=Math.round((100/count + Number.EPSILON) * 100) / 100
return arr.map((el)=>({
...el,
share:dividedValue

}))
}
// export const nextServiceHandler=(allData=,type,typeData)=>{
//   const myItem=allData?.findIndex((el)=>el.type===type);
//   if (myItem===-1) {
//    return allData.push(...typeData);
//   } else {
//     allData=allData.filter((el)=>el.type !==type);
//    return allData=[...allData,...typeData]
//   }
// }