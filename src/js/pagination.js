import Pagination from 'tui-pagination';
import 'tui-pagination/dist/tui-pagination.css';

export default  total => {
    const options = {
        totalItems: total,
        itemsPerPage: 20,
        visiblePages: 8,
    };
    return new Pagination('paginator', options);   

}

