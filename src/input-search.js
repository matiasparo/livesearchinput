import { viewResult, showLoading, hideLoading } from "./views";
import { EMPTY, fromEvent, of, throwError } from "rxjs";
import { ajax } from "rxjs/ajax";
import {
  filter,
  map,
  debounceTime,
  mergeMap,
  catchError,
  tap,
} from "rxjs/operators";

const URL = "https://rickandmortyapi.com/api/character/";
const MIN_LENGTH = 0;
const MAX_RESULT = 4;


function fetchAPIByName(searchTerm) {
  const empty$ = of({data:[], searchTerm});

  if(searchTerm === ''){
    return empty$;
  }
  return ajax.getJSON(`${URL}?name=${searchTerm}`).pipe(
    map((response) => {
      return { data: response.results, searchTerm };
    }),
    catchError((err) => {
      console.log("el error del get");
      return empty$
    })
  );
}
function fetchAPIById(id) {
  return ajax.getJSON(`${URL}${id}`).pipe(
    map((response) => {
      return { data: response };
    }),
    catchError((err) => {
      console.log("el error del get");
      return of({ data: [] });
    })
  );
}


function getAPIByID(id){
  return fetchAPIById(id);
}

function showBoxSearch(){
  const contentResult = document.getElementById("result-content-item");
  contentResult.style.display = 'block';
}

function hideBoxSearch(){
  const contentResult = document.getElementById("result-content-item");
  contentResult.style.display = 'none';
}


export default () => {
  const input = document.getElementById("input-search-view");
  const searchInput$ = fromEvent(input, "keyup").pipe(
    debounceTime(500),
    map((event) => {
      return event.target.value.toLowerCase();
    }),
    filter((searchTerm) => searchTerm.length >= MIN_LENGTH),
    mergeMap((searchTerm) => fetchAPIByName(searchTerm)),
    map(({ data, searchTerm }, index) => {
      return { data: [...data.slice(0, MAX_RESULT)], searchTerm };
    }),
    map(({ data, searchTerm }) => {
      return {
        data: data.map((x) => {
          return { id: x.id, name: x.name };
        }),
        searchTerm,
      };
    })
  );
  const subscription = searchInput$.subscribe(
    ({ data, searchTerm }) => {
      showBoxSearch();
      viewResult(data, searchTerm);
    }    
  );

  const element = document.getElementById("result-content-item");
  const click$ = fromEvent(element, "click");
  const subsciption2 = click$.subscribe((data) => {    
    const id = data.target.getAttribute('data-id');
    const name = data.target.getAttribute('data-name');
    input.value = name;
    showLoading();
    getAPIByID(id).subscribe(data=>{
      //TODO: implement results view
      //hide loading after api result
      //hideLoading();
      // simulate delay with server
      setTimeout(()=>{
        hideLoading();
      },1000);
    });
    hideBoxSearch();
  });
};
