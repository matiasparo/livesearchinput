import { viewResult, showLoading, hideLoading, hideBoxSearch, showBoxSearch } from "./views";
import { EMPTY, fromEvent, of, pipe } from "rxjs";
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
const KEY_CODE_UP = 38;
const KEY_CODE_DOWN = 40;
const KEY_CODE_SELECT = 13;
const MOVEKEYCODE=[KEY_CODE_UP,KEY_CODE_DOWN];
const SELECTCODE=[KEY_CODE_SELECT];

function fetchAPIByName(searchTerm) {
  const empty$ = of({ data: [], searchTerm });

  if (searchTerm === "") {
    return empty$;
  }
  return ajax.getJSON(`${URL}?name=${searchTerm}`).pipe(
    map((response) => {
      return { data: response.results, searchTerm };
    }),
    catchError((err) => {
      //console.log("el error del get");
      return empty$;
    })
  );
}
function fetchAPIById(id) {
  return ajax.getJSON(`${URL}${id}`).pipe(
    map((response) => {
      return { data: response };
    }),
    catchError((err) => {
      //console.log("el error del get");
      return of({ data: [] });
    })
  );
}

function getAPIByID(id) {
  return fetchAPIById(id);
}



const pipeLogicSearch = () => {
  return pipe(
    filter(({keyCode})=>!MOVEKEYCODE.includes(keyCode) && !SELECTCODE.includes(keyCode)),
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
};

const pipeLogicMove = () =>{
  return pipe(
    filter(({keyCode})=> MOVEKEYCODE.includes(keyCode))
  );
}

const pipeLogicSelect = () =>{
  return pipe(
    filter(({keyCode})=> SELECTCODE.includes(keyCode))
  )
}

const selectItemResult = (item) => {
  const input = document.getElementById("input-search-view");
  input.value = item.name;
  showLoading();
  getAPIByID(item.id).subscribe((data) => {
    //TODO: implement results view
    //hide loading after api result
    //hideLoading();
    // simulate delay with server
    setTimeout(() => {
      hideLoading();
    }, 1000);
  });
  hideBoxSearch();
}


export default () => {

  const input = document.getElementById("input-search-view");
  const inputKeydown$ = fromEvent(input, "keydown");
  const contentResult = document.getElementById("result-content-item");

  const searchInput$ = inputKeydown$.pipe(pipeLogicSearch());
  const moveInput$ = inputKeydown$.pipe(pipeLogicMove());
  const selectInput$ = inputKeydown$.pipe(pipeLogicSelect());

  searchInput$.subscribe(({ data, searchTerm }) => {
    showBoxSearch();
    viewResult(data, searchTerm);
  });


  moveInput$.subscribe(({keyCode})=>{
    const listResult = contentResult.querySelectorAll('div');
    const indexFocus = Array.from(listResult).findIndex(x=>x.classList.contains('focus'));
    listResult.forEach(x=>x.classList.remove('focus'));

    if(indexFocus !== -1){
      let indexNew = 0;
      // up
      if(keyCode=== KEY_CODE_UP){
        indexNew = (indexFocus === 0) ? (listResult.length - 1) : indexFocus - 1;
      }else{//down
        indexNew = (listResult.length - 1 === indexFocus) ? 0 : indexFocus + 1;
      }
      listResult[indexNew].classList.add('focus');
    }else{
      listResult[0].classList.add('focus');
    }
  });

  selectInput$.subscribe(()=>{
    const selectElementList = contentResult.getElementsByClassName('focus');
    if(selectElementList.length > 0){
      const id = selectElementList[0].getAttribute("data-id");
      const name =selectElementList[0].getAttribute("data-name");
      selectItemResult({id,name});
    }
  });



  const click$ = fromEvent(contentResult, "click");
  const subsciption2 = click$.subscribe((data) => {
    const id = data.target.getAttribute("data-id");
    const name = data.target.getAttribute("data-name");
    selectItemResult({id,name});
  });
};
