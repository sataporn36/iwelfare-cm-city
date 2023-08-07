import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AppPath } from '../constans/config';
import { Affiliation } from '../model/affiliation';
import { ApproveRegisterReq } from '../model/approve-register-req';
import { Bureau } from '../model/bureau';
import { CancelRegisterReq } from '../model/cancel-register-req';
import { Department } from '../model/department';
import { EmployeeType } from '../model/employee-type';
import { Level } from '../model/level';
import { Marital } from '../model/marital';
import { Positions } from '../model/position';
import { SearchNewResgter } from '../model/search-new-register';

@Injectable({
  providedIn: 'root'
})
export class MainService {

  userId = new BehaviorSubject<number | undefined>(undefined);

  constructor(private http: HttpClient) { }

  // getCustomers(params?: any) {
  //   return this.http.get<any>('https://www.primefaces.org/data/customers', { params: params });
  // }

  getProductsData() {
    return [
        {
            id: '1000',
            code: 'f230fh0g3',
            name: 'Bamboo Watch',
            description: 'Product Description',
            image: 'bamboo-watch.jpg',
            price: 65,
            category: 'Accessories',
            quantity: 24,
            inventoryStatus: 'INSTOCK',
            rating: 5
        },
        {
            id: '1001',
            code: 'nvklal433',
            name: 'Black Watch',
            description: 'Product Description',
            image: 'black-watch.jpg',
            price: 72,
            category: 'Accessories',
            quantity: 61,
            inventoryStatus: 'OUTOFSTOCK',
            rating: 4
        },
        {
            id: '1002',
            code: 'zz21cz3c1',
            name: 'Blue Band',
            description: 'Product Description',
            image: 'blue-band.jpg',
            price: 79,
            category: 'Fitness',
            quantity: 2,
            inventoryStatus: 'LOWSTOCK',
            rating: 3
        },
        {
            id: '1003',
            code: '244wgerg2',
            name: 'Blue T-Shirt',
            description: 'Product Description',
            image: 'blue-t-shirt.jpg',
            price: 29,
            category: 'Clothing',
            quantity: 25,
            inventoryStatus: 'INSTOCK',
            rating: 5
        },
        {
            id: '1004',
            code: 'h456wer53',
            name: 'Bracelet',
            description: 'Product Description',
            image: 'bracelet.jpg',
            price: 15,
            category: 'Accessories',
            quantity: 73,
            inventoryStatus: 'INSTOCK',
            rating: 4
        },
        {
            id: '1005',
            code: 'av2231fwg',
            name: 'Brown Purse',
            description: 'Product Description',
            image: 'brown-purse.jpg',
            price: 120,
            category: 'Accessories',
            quantity: 0,
            inventoryStatus: 'OUTOFSTOCK',
            rating: 4
        },
        {
            id: '1006',
            code: 'bib36pfvm',
            name: 'Chakra Bracelet',
            description: 'Product Description',
            image: 'chakra-bracelet.jpg',
            price: 32,
            category: 'Accessories',
            quantity: 5,
            inventoryStatus: 'LOWSTOCK',
            rating: 3
        },
        {
            id: '1007',
            code: 'mbvjkgip5',
            name: 'Galaxy Earrings',
            description: 'Product Description',
            image: 'galaxy-earrings.jpg',
            price: 34,
            category: 'Accessories',
            quantity: 23,
            inventoryStatus: 'INSTOCK',
            rating: 5
        },
        {
            id: '1008',
            code: 'vbb124btr',
            name: 'Game Controller',
            description: 'Product Description',
            image: 'game-controller.jpg',
            price: 99,
            category: 'Electronics',
            quantity: 2,
            inventoryStatus: 'LOWSTOCK',
            rating: 4
        },
        {
            id: '1009',
            code: 'cm230f032',
            name: 'Gaming Set',
            description: 'Product Description',
            image: 'gaming-set.jpg',
            price: 299,
            category: 'Electronics',
            quantity: 63,
            inventoryStatus: 'INSTOCK',
            rating: 3
        },
        {
            id: '1010',
            code: 'plb34234v',
            name: 'Gold Phone Case',
            description: 'Product Description',
            image: 'gold-phone-case.jpg',
            price: 24,
            category: 'Accessories',
            quantity: 0,
            inventoryStatus: 'OUTOFSTOCK',
            rating: 4
        },
        {
            id: '1011',
            code: '4920nnc2d',
            name: 'Green Earbuds',
            description: 'Product Description',
            image: 'green-earbuds.jpg',
            price: 89,
            category: 'Electronics',
            quantity: 23,
            inventoryStatus: 'INSTOCK',
            rating: 4
        },
        {
            id: '1012',
            code: '250vm23cc',
            name: 'Green T-Shirt',
            description: 'Product Description',
            image: 'green-t-shirt.jpg',
            price: 49,
            category: 'Clothing',
            quantity: 74,
            inventoryStatus: 'INSTOCK',
            rating: 5
        },
        {
            id: '1013',
            code: 'fldsmn31b',
            name: 'Grey T-Shirt',
            description: 'Product Description',
            image: 'grey-t-shirt.jpg',
            price: 48,
            category: 'Clothing',
            quantity: 0,
            inventoryStatus: 'OUTOFSTOCK',
            rating: 3
        },
        {
            id: '1014',
            code: 'waas1x2as',
            name: 'Headphones',
            description: 'Product Description',
            image: 'headphones.jpg',
            price: 175,
            category: 'Electronics',
            quantity: 8,
            inventoryStatus: 'LOWSTOCK',
            rating: 5
        },
        {
            id: '1015',
            code: 'vb34btbg5',
            name: 'Light Green T-Shirt',
            description: 'Product Description',
            image: 'light-green-t-shirt.jpg',
            price: 49,
            category: 'Clothing',
            quantity: 34,
            inventoryStatus: 'INSTOCK',
            rating: 4
        },
        {
            id: '1016',
            code: 'k8l6j58jl',
            name: 'Lime Band',
            description: 'Product Description',
            image: 'lime-band.jpg',
            price: 79,
            category: 'Fitness',
            quantity: 12,
            inventoryStatus: 'INSTOCK',
            rating: 3
        },
        {
            id: '1017',
            code: 'v435nn85n',
            name: 'Mini Speakers',
            description: 'Product Description',
            image: 'mini-speakers.jpg',
            price: 85,
            category: 'Clothing',
            quantity: 42,
            inventoryStatus: 'INSTOCK',
            rating: 4
        },
        {
            id: '1018',
            code: '09zx9c0zc',
            name: 'Painted Phone Case',
            description: 'Product Description',
            image: 'painted-phone-case.jpg',
            price: 56,
            category: 'Accessories',
            quantity: 41,
            inventoryStatus: 'INSTOCK',
            rating: 5
        },
        {
            id: '1019',
            code: 'mnb5mb2m5',
            name: 'Pink Band',
            description: 'Product Description',
            image: 'pink-band.jpg',
            price: 79,
            category: 'Fitness',
            quantity: 63,
            inventoryStatus: 'INSTOCK',
            rating: 4
        },
        {
            id: '1020',
            code: 'r23fwf2w3',
            name: 'Pink Purse',
            description: 'Product Description',
            image: 'pink-purse.jpg',
            price: 110,
            category: 'Accessories',
            quantity: 0,
            inventoryStatus: 'OUTOFSTOCK',
            rating: 4
        },
        {
            id: '1021',
            code: 'pxpzczo23',
            name: 'Purple Band',
            description: 'Product Description',
            image: 'purple-band.jpg',
            price: 79,
            category: 'Fitness',
            quantity: 6,
            inventoryStatus: 'LOWSTOCK',
            rating: 3
        },
        {
            id: '1022',
            code: '2c42cb5cb',
            name: 'Purple Gemstone Necklace',
            description: 'Product Description',
            image: 'purple-gemstone-necklace.jpg',
            price: 45,
            category: 'Accessories',
            quantity: 62,
            inventoryStatus: 'INSTOCK',
            rating: 4
        },
        {
            id: '1023',
            code: '5k43kkk23',
            name: 'Purple T-Shirt',
            description: 'Product Description',
            image: 'purple-t-shirt.jpg',
            price: 49,
            category: 'Clothing',
            quantity: 2,
            inventoryStatus: 'LOWSTOCK',
            rating: 5
        },
        {
            id: '1024',
            code: 'lm2tny2k4',
            name: 'Shoes',
            description: 'Product Description',
            image: 'shoes.jpg',
            price: 64,
            category: 'Clothing',
            quantity: 0,
            inventoryStatus: 'INSTOCK',
            rating: 4
        },
        {
            id: '1025',
            code: 'nbm5mv45n',
            name: 'Sneakers',
            description: 'Product Description',
            image: 'sneakers.jpg',
            price: 78,
            category: 'Clothing',
            quantity: 52,
            inventoryStatus: 'INSTOCK',
            rating: 4
        },
        {
            id: '1026',
            code: 'zx23zc42c',
            name: 'Teal T-Shirt',
            description: 'Product Description',
            image: 'teal-t-shirt.jpg',
            price: 49,
            category: 'Clothing',
            quantity: 3,
            inventoryStatus: 'LOWSTOCK',
            rating: 3
        },
        {
            id: '1027',
            code: 'acvx872gc',
            name: 'Yellow Earbuds',
            description: 'Product Description',
            image: 'yellow-earbuds.jpg',
            price: 89,
            category: 'Electronics',
            quantity: 35,
            inventoryStatus: 'INSTOCK',
            rating: 3
        }
    ]
  }

  getProductsSmall() {
    return Promise.resolve(this.getProductsData().slice(0, 10));
  }

  register(playload: any): Observable<any> {
    return this.http.post<any>(
      AppPath.APP_API_SERVICE + '/logic/v1/register/add-employee', playload
    );
  }

  editStatusEmployeeResign(playload: any): Observable<any> {
    return this.http.put<any>(
      AppPath.APP_API_SERVICE + '/logic/v1/register/editStatusEmployeeResign', playload
    );
  }

  login(playload: any): Observable<any> {
    return this.http.post<any>(
      AppPath.APP_API_SERVICE + '/logic/v1/login/user-login', playload
    );
  }

  changePassword(playload: any): Observable<any> {
    return this.http.post<any>(
      AppPath.APP_API_SERVICE + '/logic/v1/login/change/forget-password', playload
    );
  }

  resetPassword(playload: any): Observable<any> {
    return this.http.put<any>(
      AppPath.APP_API_SERVICE + '/logic/v1/login/change/reset-password', playload
    );
  }

  searchRegister(): Observable<SearchNewResgter[]> {
    return this.http.post<SearchNewResgter[]>(AppPath.APP_API_SERVICE + '/logic/v1/register/search-register', null);
  }

  searchPosition(): Observable<Positions[]> {
    return this.http.post<Positions[]>(AppPath.APP_API_SERVICE + '/v1/position/search', null);
  }

  searchDepartment(): Observable<Department[]> {
    return this.http.post<Department[]>(AppPath.APP_API_SERVICE + '/v1/department/search', null);
  }

  searchBureau(): Observable<Bureau[]> {
    return this.http.post<Bureau[]>(AppPath.APP_API_SERVICE + '/v1/bureau/search', null);
  }

  searchByBureau(id: number): Observable<Affiliation[]> {
    return this.http.post<Affiliation[]>(AppPath.APP_API_SERVICE + '/v1/affiliation/search-by-bureau/' + id, null);
  }

  searchAffiliation(): Observable<Affiliation[]> {
    return this.http.post<Affiliation[]>(AppPath.APP_API_SERVICE + '/v1/affiliation/search', null);
  }

  approveRegister(req: ApproveRegisterReq): Observable<any> {
    return this.http.patch<any>(
      AppPath.APP_API_SERVICE + '/logic/v1/register/approve-register', req
    );
  }

  getEmployee(id: number): Observable<any> {
    return this.http.get<any>(
      AppPath.APP_API_SERVICE + '/logic/v1/employee/' + id,
    );
  }

  cancelApproveRegister(req: CancelRegisterReq): Observable<any> {
    return this.http.patch<any>(
      AppPath.APP_API_SERVICE + '/logic/v1/register/cancel-approve-register', req);
  }

  conutNewRegister(): Observable<any> {
    return this.http.post<any>(AppPath.APP_API_SERVICE + '/logic/v1/register/count-register', null);
  }


  updateEmp(playload: any): Observable<any> {
    return this.http.patch<any>(
      AppPath.APP_API_SERVICE + '/v1/employee', playload
    );
  }

  updateBeneficiary(playload: any): Observable<any> {
    return this.http.patch<any>(
      AppPath.APP_API_SERVICE + '/v1/beneficiary', playload
    );
  }

  getBeneficiary(id: number): Observable<any> {
    return this.http.get<any>(
      AppPath.APP_API_SERVICE + '/v1/beneficiary/' + id,
    );
  }

  deleteBeneficiary(id: number): Observable<any> {
    return this.http.delete<any>(
      AppPath.APP_API_SERVICE + '/v1/beneficiary/' + id,
    );
  }

  searchLevel(): Observable<Level[]> {
    return this.http.post<Level[]>(AppPath.APP_API_SERVICE + '/v1/level/search', null);
  }

  searchEmployeeType(): Observable<EmployeeType[]> {
    return this.http.post<EmployeeType[]>(AppPath.APP_API_SERVICE + '/v1/employee-type/search', null);
  }

  searchStockDetail(id: number, value: string): Observable<any[]> {
    return this.http.post<any[]>(AppPath.APP_API_SERVICE + '/v1/stock-detail/search-by-stock/' + id + '/' + value, null);
  }

  searchStock(): Observable<any[]> {
    return this.http.post<any[]>(AppPath.APP_API_SERVICE + '/logic/v1/stock/search', null);
  }

  updateStock(playload: any): Observable<any> {
    return this.http.patch<any>(
      AppPath.APP_API_SERVICE + '/v1/stock', playload
    );
  }

  updateResign(playload: any): Observable<any> {
    return this.http.patch<any>(
      AppPath.APP_API_SERVICE + '/v1/employee/update-resign', playload
    );
  }

  updateStockValue(playload: any): Observable<any> {
    return this.http.patch<any>(
      AppPath.APP_API_SERVICE + '/v1/employee/update-stock-value', playload
    );
  }

  searchNotify(): Observable<any[]> {
    return this.http.post<any[]>(AppPath.APP_API_SERVICE + '/v1/notify/search', null);
  }

  searchLoanDetail(playload: any): Observable<any[]> {
    return this.http.post<any[]>(AppPath.APP_API_SERVICE + '/v1/loan-detail/search-by-loan',playload);
  }

  searchLoan(): Observable<any[]> {
    return this.http.post<any[]>(AppPath.APP_API_SERVICE + '/logic/v1/loan/search', null);
  }

  updateResignAdmin(playload: any): Observable<any> {
    return this.http.patch<any>(
      AppPath.APP_API_SERVICE + '/v1/employee/update-resign-admin', playload
    );
  }

  getGrandTotal(payload: any): Observable<any[]> {
    return this.http.post<any[]>(AppPath.APP_API_SERVICE + '/logic/v1/document/grand-total', payload);
  }

  searchDocumentV1(playload: any): Observable<any[]> {
    return this.http.post<any[]>(AppPath.APP_API_SERVICE + '/logic/v1/document/search', playload);
  }

  searchDocumentV2Sum(playload: any): Observable<any[]> {
    return this.http.post<any[]>(AppPath.APP_API_SERVICE + '/logic/v2/document/search', playload);
  }

  documentInfoAll(playload: any): Observable<any[]> {
    return this.http.post<any[]>(AppPath.APP_API_SERVICE + '/logic/v1/document/info-all', playload);
  }

  searchDocumentV1Loan(playload: any): Observable<any[]> {
    return this.http.post<any[]>(AppPath.APP_API_SERVICE + '/logic/v1/document/searchLoan', playload);
  }

  searchDocumentV2SumLoan(playload: any): Observable<any[]> {
    return this.http.post<any[]>(AppPath.APP_API_SERVICE + '/logic/v2/document/searchLoan', playload);
  }

  updateEmployeeStatus(playload: any): Observable<any> {
    return this.http.patch<any>(
      AppPath.APP_API_SERVICE + '/v1/employee/update-emp-status', playload
    );
  }

  insertStockDetail(playload: any): Observable<any> {
    return this.http.post<any>(
      AppPath.APP_API_SERVICE + '/logic/v1/stock/add-all', playload
    );
  }

  insertLoanDetail(playload: any): Observable<any> {
    return this.http.post<any>(
      AppPath.APP_API_SERVICE + '/logic/v1/loan/add-all', playload
    );
  }

  getEmployeeOfMain(id: number): Observable<any> {
    return this.http.get<any>(
      AppPath.APP_API_SERVICE + '/logic/v1/employee/of-main/' + id,
    );
  }

  getStock(id: number): Observable<any> {
    return this.http.get<any>(
      AppPath.APP_API_SERVICE + '/v1/stock/' + id,
    );
  }

  cancelNotification(id: number, empId: number): Observable<any> {
    return this.http.delete<any>(
      AppPath.APP_API_SERVICE + '/v1/notify/cancel/' + id + '/' + empId,
    );
  }

  searchEmployeeLoanNew(playload: any): Observable<any> {
    return this.http.post<any>(
      AppPath.APP_API_SERVICE + '/logic/v1/document/searchLoan-add-new', playload
    );
  }

  onCalculateLoanOld(playload: any): Observable<any> {
    return this.http.post<any>(
      AppPath.APP_API_SERVICE + '/logic/v1/document/calculate-loan-old', playload
    );
  }

  onCalculateLoanNew(playload: any): Observable<any> {
    return this.http.post<any>(
      AppPath.APP_API_SERVICE + '/logic/v1/document/calculate-loan-new', playload
    );
  }

  searchGuarantorUnique(playload: any): Observable<any> {
    return this.http.post<any>(
      AppPath.APP_API_SERVICE + '/logic/v1/document/searchLoan-guarantor-unique', playload
    );
  }

  searchEmpCodeOfId(playload: any): Observable<any> {
    return this.http.post<any>(
      AppPath.APP_API_SERVICE + '/logic/v1/document/search-emp-code-of-id', playload
    );
  }

  getGuarantor(id: number): Observable<any> {
    return this.http.get<any>(
      AppPath.APP_API_SERVICE + '/logic/v1/loan/guarantor/' + id,
    );
  }

  getGuarantee(id: number): Observable<any> {
    return this.http.get<any>(
      AppPath.APP_API_SERVICE + '/logic/v1/loan/guarantee/' + id,
    );
  }

  getBeneficiaryByEmpId(id: number): Observable<any> {
    return this.http.get<any>(
      AppPath.APP_API_SERVICE + '/logic/v1/loan/beneficiary/' + id,
    );
  }

  searchBeneficiary(id: number): Observable<any> {
    return this.http.get<any>(
      AppPath.APP_API_SERVICE + '/logic/v1/loan/beneficiary/search/' + id,
    );
  }

  updateBeneficiaryLogic(playload: any): Observable<any> {
    return this.http.patch<any>(
      AppPath.APP_API_SERVICE + '/logic/v1/loan/beneficiary/update', playload
    );
  }

  insertLoanNew(playload: any): Observable<any> {
    return this.http.post<any>(
      AppPath.APP_API_SERVICE + '/v1/loan/add-loan-New', playload
    );
  }

  closeLoan(id: number): Observable<any> {
    return this.http.get<any>(
      AppPath.APP_API_SERVICE + '/logic/v1/loan/close/' + id,
    );
  }

  // displayImage(id: number): Observable<any[]> {
  //   return this.http.get<any[]>(
  //     AppPath.APP_API_SERVICE + '/v1/file-resource/display/' + id,
  //   );
  // }

  getImage(id: number): Observable<Blob> {
    return this.http.get<Blob>(
      AppPath.APP_API_SERVICE + '/v1/file-resource/display/' + id, { responseType: 'blob' as 'json' }
    );
  }
  
  getImageIdCard(id: number): Observable<Blob> {
    return this.http.get<Blob>(
      AppPath.APP_API_SERVICE + '/v1/file-resource/display/id-card/' + id, { responseType: 'blob' as 'json' }
    );
  }

  getImageAddress(id: number): Observable<Blob> {
    return this.http.get<Blob>(
      AppPath.APP_API_SERVICE + '/v1/file-resource/display/address/' + id, { responseType: 'blob' as 'json' }
    );
  }

  uploadImage(playload: any): Observable<any> {
    return this.http.post(
      AppPath.APP_API_SERVICE + '/v1/file-resource/add', playload 
    );
  }

  uploadImageIdCard(playload: any): Observable<any> {
    return this.http.post(
      AppPath.APP_API_SERVICE + '/v1/file-resource/add-id-card', playload 
    );
  }

  uploadImageAddress(playload: any): Observable<any> {
    return this.http.post(
      AppPath.APP_API_SERVICE + '/v1/file-resource/add-address', playload 
    );
  }

  calculateStockDividend(playload: any): Observable<any> {
    return this.http.post<any>(
      AppPath.APP_API_SERVICE + '/logic/v1/document/calculate-dividend', playload
    );
  }

  getConfigByList(): Observable<any> {
    return this.http.post<any>(
      AppPath.APP_API_SERVICE + '/admin/logic/document/getConfigByList', null
    );
  }

  editConfig(payload: any): Observable<any> {
    return this.http.post<any>(
      AppPath.APP_API_SERVICE + '/admin/logic/document/updateConfig', payload
    );
  }

  getImageConfig(id: number): Observable<Blob> {
    return this.http.get<Blob>(
      AppPath.APP_API_SERVICE + '/admin/logic/document/getImageConfig/' + id, { responseType: 'blob' as 'json' }
    );
  }

  uploadImageConfig(playload: any): Observable<any> {
    return this.http.post(
      AppPath.APP_API_SERVICE + '/admin/logic/document/getImageConfig/add', playload 
    );
  }

  getEmployeeByList(playload: any): Observable<any> {
    return this.http.post<any>(
      AppPath.APP_API_SERVICE + '/admin/logic/document/getEmployeeByList', playload
    );
  }

  updateRoleEmp(playload: any): Observable<any> {
    return this.http.post<any>(
      AppPath.APP_API_SERVICE + '/admin/logic/document/updateRoleEmp', playload
    );
  }

  updateBeneficiaryId(playload: any): Observable<any> {
    return this.http.patch<any>(
      AppPath.APP_API_SERVICE + '/v1/employee/update-beneficiary-id', playload
    );
  }

  deleteNotify(id: number): Observable<any> {
    return this.http.delete<any>(
      AppPath.APP_API_SERVICE + '/v1/notify/delete-notify/' + id ,
    );
  }

  searchEmployee(): Observable<any[]> {
    return this.http.post<any[]>(AppPath.APP_API_SERVICE + '/v1/employee/search', null);
  }

  updateInfo(playload: any): Observable<any> {
    return this.http.put<any>(
      AppPath.APP_API_SERVICE + '/admin/logic/update-info', playload
    );
  }

  uploadImageNews(playload: any): Observable<any> {
    return this.http.post(
      AppPath.APP_API_SERVICE + '/v1/file-resource/add-news', playload 
    );
  }

  getImageNews(id: number): Observable<Blob> {
    return this.http.get<Blob>(
      AppPath.APP_API_SERVICE + '/v1/file-resource/display/news/' + id, { responseType: 'blob' as 'json' }
    );
  }

  searchNews(): Observable<any[]> {
    return this.http.post<any[]>(AppPath.APP_API_SERVICE + '/v1/news/search', null);
  }

  createNews(playload: any): Observable<any> {
    return this.http.post<any>(
      AppPath.APP_API_SERVICE + '/v1/news', playload
    );
  }

  getNews(id: number): Observable<any> {
    return this.http.get<any>(
      AppPath.APP_API_SERVICE + '/v1/news/' + id,
    );
  }

  editNews(playload: any): Observable<any> {
    return this.http.put<any>(
      AppPath.APP_API_SERVICE + '/v1/news/update', playload
    );
  }

  deleteNews(id: number): Observable<any> {
    return this.http.delete<any>(
      AppPath.APP_API_SERVICE + '/v1/news/' + id,
    );
  }
}
