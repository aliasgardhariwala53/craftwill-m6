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
// export const nextServiceHandler=(allData=,type,typeData)=>{
//   const myItem=allData?.findIndex((el)=>el.type===type);
//   if (myItem===-1) {
//    return allData.push(...typeData);
//   } else {
//     allData=allData.filter((el)=>el.type !==type);
//    return allData=[...allData,...typeData]
//   }
// }