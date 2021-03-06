import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { isNull } from 'util';
@Injectable()
export class MainService {

  constructor(private http: HttpClient) { }

  /**
   * @description set authorization for user's local storage
   * @param loginData 
   */
  setauthorization(data: object) {
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        localStorage.setItem(key, data[key]);
      }
    }
  }

  /**
   * @description A http request to register user
   * @param nickName 
   * @param email 
   * @param password 
   * @param role 
   */
  registerUser(nickName: string, email: string, password: string, role: string): Promise<object> {
    const data = { nickName, email, password, role };
    return this.http.post<object>(environment.API_URL + '/api/user/register', data).toPromise();
  }

  /**
   * @description A http request to get login data from server
   * @param email 
   * @param password 
   */
  loginUser(email: string, password: string): Promise<object> {
    const data = { email, password };
    return this.http.post<object>(environment.API_URL + '/api/user/login', data).toPromise();
  }

  /**
   * @description A http request to get all categories
   */
  getCategories(): Promise<object[]> {
    return this.http.get<object[]>(environment.API_URL + '/api/category').toPromise();
  }

  /**
   * @description A http request to add categories
   * @param title 
   * @param slug 
   * @param isParent 
   * @param parentId 
   * @param positionMode 
   * @param index 
   */
  addCategory(
    title: string, slug: string,
    isParent: boolean, parentId: string,
    positionMode: string, index: number
  ): Promise<string> {
    const data = { title, slug, isParent, parentId, positionMode, index };
    return this.http.put(
      environment.API_URL + '/api/category/add', data,
      { responseType: 'text' }
    ).toPromise();
  }

  /**
   * @description A http request to delete categories
   * @param categoryId 
   * @param isParent 
   */
  deleteCategory(categoryId: number, isParent: number): Promise<string> {
    return this.http.delete(
      environment.API_URL + `/api/category/delete?isParent=${isParent}&categoryId=${categoryId}`,
      { responseType: 'text' }
    ).toPromise();
  }

  /**
   * @description A http request to edit categories
   * @param categoryId 
   * @param isParent 
   */
  editCategory(
    isParent: boolean, id: number,
    title: string, slug: string,
    color?: string, backColor?: string
  ): Promise<string> {
    return this.http.patch(
      environment.API_URL + `/api/category/edit`,
      { isParent, id, title, slug, color: color || '', backColor: backColor || '' },
      { responseType: 'text' }
    ).toPromise();
  }

  /**
   * @description orders given data in the best way to use
   * @param categories
   * @returns orderedData
   */
  orderCategoryData(categories) {
    const orderedData = [];

    for (const category of categories) {
      if (orderedData.length) {
        if (category.CATEGORY_GROUP_ID !== orderedData[orderedData.length - 1].id) {
          orderedData.push(newItem(category));
        } else {
          orderedData[orderedData.length - 1].categories.push({
            id: category.CATEGORY_ID,
            slug: category.CATEGORY_SLUG,
            position: category.CATEGORY_POSITION,
            title: category.CATEGORY_TITLE,
            createDate: category.CATEGORY_CREATE_DATE,
            hover: false
          });
        }
      } else {
        orderedData.push(newItem(category));
      }
    }

    function newItem(input) {
      return {
        id: input.CATEGORY_GROUP_ID,
        slug: input.CATEGORY_GROUP_SLUG,
        uiColor: input.UI_COLOR,
        backUiColor: input.BACK_UI_COLOR,
        position: input.CATEGORY_GROUP_POSITION,
        title: input.CATEGORY_GROUP_TITLE,
        createDate: input.CATEGORY_GROUP_CREATE_DATE,
        hover: false,
        categories: [{
          id: input.CATEGORY_ID,
          slug: input.CATEGORY_SLUG,
          position: input.CATEGORY_POSITION,
          title: input.CATEGORY_TITLE,
          createDate: input.CATEGORY_CREATE_DATE,
          hover: false
        }]
      };
    }

    return orderedData;
  }

  /**
   * @description A http request to get all genres
   */
  getGenres(): Promise<object[]> {
    return this.http.get<object[]>(environment.API_URL + '/api/genre').toPromise();
  }

  /**
   * @description A http request to add genres
   * @param title 
   * @param slug 
   * @param isParent 
   * @param parentId 
   * @param positionMode 
   * @param index 
   */
  addGenre(
    title: string, slug: string,
    isParent: boolean, parentId: string,
    positionMode: string, index: number
  ): Promise<string> {
    const data = { title, slug, isParent, parentId, positionMode, index };
    return this.http.put(
      environment.API_URL + '/api/genre/add', data, {
        responseType: 'text'
      }
    ).toPromise();
  }


  /**
   * @description A http request to delete genres
   * @param categoryId 
   * @param isParent 
   */
  deleteGenere(genreId: number, isParent: number): Promise<string> {
    return this.http.delete(
      environment.API_URL + `/api/genre/delete?isParent=${isParent}&genereId=${genreId}`,
      { responseType: 'text' }
    ).toPromise();
  }

  /**
  * @description A http request to edit genres
  * @param categoryId 
  * @param isParent 
  */
  editGenre(
    isParent: boolean, id: number,
    title: string, slug,
    color?: string, backColor?: string
  ): Promise<string> {
    return this.http.patch(
      environment.API_URL + `/api/category/edit`, {
        isParent, id, title, slug, color: color || '', backColor: backColor || ''
      },
      { responseType: 'text' }
    ).toPromise();
  }

  /**
   * @description orders given data in the best way to use
   * @param genres
   * @returns orderedData
   */
  orderGenreData(genres) {
    const orderedData = [];

    for (const genre of genres) {
      if (orderedData.length) {
        if (genre.GENRE_GROUP_ID !== orderedData[orderedData.length - 1].id) {
          orderedData.push(newItem(genre));
        } else {
          orderedData[orderedData.length - 1].genres.push({
            id: genre.GENRE_ID,
            slug: genre.GENRE_SLUG,
            position: genre.GENRE_POSITION,
            title: genre.GENRE_NAME,
            createDate: genre.GENRE_CREATE_DATE,
            hover: false
          });
        }
      } else {
        orderedData.push(newItem(genre));
      }
    }

    function newItem(input) {
      return {
        id: input.GENRE_GROUP_ID,
        slug: input.GENRE_GROUP_SLUG,
        uiColor: input.UI_COLOR,
        backUiColor: input.BACK_UI_COLOR,
        position: input.GENRE_GROUP_POSITION,
        title: input.GENRE_GROUP_NAME,
        createDate: input.GENRE_GROUP_CREATE_DATE,
        hover: false,
        genres: [{
          id: input.GENRE_ID,
          slug: input.GENRE_SLUG,
          position: input.GENRE_POSITION,
          title: input.GENRE_NAME,
          createDate: input.GENRE_CREATE_DATE,
          hover: false
        }]
      };
    }

    return orderedData;
  }




  /**
   * @description Clears the localstorage
   */
  removeLoginData() {
    localStorage.clear();
  }

  getRole(): string {
    return localStorage.getItem('userRole');
  }
  getNickName(): string {
    return localStorage.getItem('nickName');
  }
  getEmail(): string {
    return localStorage.getItem('email');
  }
  getUserRoleId(): string {
    return localStorage.getItem('userRoleId');
  }
  getToken(): string {
    return localStorage.getItem('token');
  }
}
