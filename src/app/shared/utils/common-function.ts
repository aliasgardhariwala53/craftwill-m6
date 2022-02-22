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
