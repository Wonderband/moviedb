import Pagination from 'tui-pagination';
import 'tui-pagination/dist/tui-pagination.css';

const bodyEl = document.querySelector('body');

export default  total => {
    let pagesVisible = 5;    
    if ((bodyEl.clientWidth >= 768))
        pagesVisible = 7;        
      
    const options = {
        totalItems: total,
        itemsPerPage: 20,
        visiblePages: pagesVisible,
    };
    return new Pagination('paginator', options);   

}

