import { Component, OnInit } from "@angular/core";
import { RouterModule, Router } from "@angular/router";
import { AuthenticationService } from "../../_services/authentication.service";
import { environment } from "../../../environments/environment";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ChangePasswordComponent } from "../../change-password/change-password.component";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.css"],
})
export class NavbarComponent implements OnInit {
  public environment = environment;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private modalService: NgbModal
  ) {}
  username: string;

  ngOnInit() {
    let user = JSON.parse(localStorage.getItem("currentUser"));
    this.username = user["username"];
  }

  LogOut() {
    localStorage.clear();
    this.router.navigate(["/login"]);
  }

  ChangePassword() {
    const modalRef = this.modalService.open(ChangePasswordComponent, {
      size: "sm",
    });
    //modalRef.componentInstance.responseOrder = this.Order;
    modalRef.result.then(
      (result) => {
        this.LogOut();
      },
      (reason) => {}
    );
  }
}
