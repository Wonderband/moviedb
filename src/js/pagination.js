import Pagination from 'tui-pagination';
import 'tui-pagination/dist/tui-pagination.css';

export default  total => {
    let pagesVisible = 5;
    if ((window.screen.width >= 768))
        pagesVisible = 9;        
      
    const options = {
        totalItems: total,
        itemsPerPage: 20,
        visiblePages: pagesVisible,
    };
    return new Pagination('paginator', options);   

}

