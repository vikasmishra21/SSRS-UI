import { Directive, ElementRef, OnInit, Input} from '@angular/core';

@Directive({
  selector: '[appPermission]'
})
export class PermissionDirective {
    @Input() permissionCode: string;
    
    constructor(private el: ElementRef) {

    }
    ngOnInit() {
        let item = localStorage.getItem('Permissions');
        if(item){
        let itemArray = item.split(",");
        if (itemArray.indexOf(this.permissionCode) == -1)
            this.el.nativeElement.style.display = "none";
        }
    }

}
