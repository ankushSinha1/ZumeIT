export const monthNumToName = (date) => {
    //MONTHS
    if(date.getMonth() === 1-1){
        date.month = 'January'
    }else if(date.getMonth() === 2-1){
        date.month = 'February'
    }else if(date.getMonth() === 3-1){
        date.month = 'March'
    }else if(date.getMonth() === 4-1){
        date.month = 'April'
    }else if(date.getMonth() === 5-1){
        date.month = 'May'
    }else if(date.getMonth() === 6-1){
        date.month = 'June'
    }else if(date.getMonth() === 7-1){
        date.month = 'July'
    }else if(date.getMonth() === 8-1){
        date.month = 'August'
    }else if(date.getMonth() === 9-1){
        date.month = 'September'
    }else if(date.getMonth() === 10-1){
        date.month = 'October'
    }else if(date.getMonth() === 10){
        date.month = 'November'
    }else if(date.getMonth() === 11){
        date.month = 'December'
    }
    return date
}