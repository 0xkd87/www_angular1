/**
 * @author [kd]
 * @email [karna.dalal@gmail.com]
 * @create date 2018-09-10 09:37:38
 * @modify date 2018-09-26 12:01:05
 * @desc [description]
*/


import { Subscription, Observable } from 'rxjs';
import { isArray } from 'util';
import { HttpTxRxService } from '../../_shared/services/http-TxRx.service';
import { Injectable, OnDestroy } from '@angular/core';
import { UrlBuilderService } from '../../_shared/services/urlBuilder.service';
import { IProject } from './../../_shared/interface/IProject.interface';

@Injectable({
  providedIn: 'root'
})
export class PrjCrudService implements OnDestroy {
  public error: string;

  _subscriptionGet: Subscription;
  _subscriptionPost: Subscription;



constructor(
  private _http: HttpTxRxService,
  private _urlBuilder: UrlBuilderService,
) {
  this.li_Init();


  // define url calling function
  this._url = (op: string) => {
    return this._urlBuilder.url__PRJ(op);
  };
}
private _url;

private li: {  // Lists - arrays
  prj: IProject[]; // Project Objects
  prjName: string[]; // populated project names
  prjNum: string[]; // populated project numbers
};




/* initialize the rx aray */
private li_Init() {
  this.li = {prj: [], prjName: [], prjNum: []}; // no null, no undefined..!
}
get li_prj() {
 return this.li.prj;
}

get li_prjName() {
  return this.li.prjName;
}

get li_prjNum() {
  return this.li.prjNum;
}

ngOnDestroy() {
  // prevent memory leak when component destroyed
  if (this._subscriptionGet) {
    this._subscriptionGet.unsubscribe();
  }
  if (this._subscriptionPost) {
  this._subscriptionPost.unsubscribe();
  }
}

_rGet() {
  this.li_Init();  // no null, no undefined..!
  this._subscriptionGet = this._http.reqGET(this._url('r'))
  .subscribe(
      rxData => { // catch
        const rxArr = <any[]>rxData;

        if (isArray(rxArr))  {
          rxArr.forEach((rx) => {
            const p = new IProject(<IProject>JSON.parse(rx));
            this.li.prj.push(p);
            this.li.prjName.push(p.prj.description);
            this.li.prjNum.push(p.prj.prjnumId);

          });
      }

      },
      error => { // throw
        this.error = error; // error path;
      },
      () => { // finally
        // something ToDo
      }
  );
}

_r() {
  this.li_Init();  // no null, no undefined..!
  this._subscriptionGet = this._http.reqPOST(
    this._url('r'),
    null,
    {
      op: 'r',
      drv: 'prj',
      dst: 'prj',
    }).subscribe(
      rxData => { // catch
        const rxArr = <any[]>rxData;

        if (isArray(rxArr))  {
          rxArr.forEach((rx) => {
            const p = new IProject(<IProject>JSON.parse(rx));
            this.li.prj.push(p);
            this.li.prjName.push(p.prj.description);
            this.li.prjNum.push(p.prj.prjnumId);
          });
      }

      },
      error => { // throw
        this.error = error; // error path;
      },
      () => { // finally
        // something ToDo
      }
  );
}

_c(p: IProject): Observable<any> {
  return this._http.reqPOST(
    this._url('c'), <IProject>(p), { op: 'c', drv: 'prj', dst: 'prj', });
}
_u(p: IProject): Observable<any> {
  return this._http.reqPOST(this._url('u'), <IProject>(p), { op: 'u', drv: 'prj', dst: 'prj', });
}

_d(p: IProject): Observable<any> {
  return this._http.reqPOST(this._url('d'), <IProject>(p), { op: 'd', drv: 'prj', dst: 'prj', });
}

public searchFor(idx: number): IProject {

  let p = null;
  if (idx >= 0) {
    this.li.prj.forEach((pr, i) => {
      if (pr.ident.idx === idx) {
        p =  new IProject(<IProject>pr);
      }
    });
  }

  return p;
}

} // class end
