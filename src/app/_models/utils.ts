export class util {
    constructor() {

    }

    ConvertUTCDateToLocal(date: string): Date {
        let parsedDate = new Date(date + 'Z');
        // var newDate = new Date(parsedDate.getTime() + parsedDate.getTimezoneOffset() * 60 * 1000);

        // var offset = parsedDate.getTimezoneOffset() / 60;
        // var hours = parsedDate.getHours();

        // newDate.setHours(hours - offset);

        return parsedDate;
    }

    ConvertLocalDateStringToUTCString(date: string): string {
        let parsedlocalDateTime = new Date(date);
        return parsedlocalDateTime.toUTCString();

        //   return Date.UTC(parsedlocalDateTime.getFullYear(), parsedlocalDateTime.getMonth(), parsedlocalDateTime.getDate(), parsedlocalDateTime.getHours(), parsedlocalDateTime.getMinutes(), parsedlocalDateTime.getSeconds(), parsedlocalDateTime.getMilliseconds());
    }

    ConvertLocalDateToUTCString(date: Date): string {
        return date.toISOString();

        //   return Date.UTC(parsedlocalDateTime.getFullYear(), parsedlocalDateTime.getMonth(), parsedlocalDateTime.getDate(), parsedlocalDateTime.getHours(), parsedlocalDateTime.getMinutes(), parsedlocalDateTime.getSeconds(), parsedlocalDateTime.getMilliseconds());
    }
}