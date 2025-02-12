import _ from 'lodash';

function debounce(func: (...args: any[]) => any) {
	
	return _.debounce(func, 300);
}

export { debounce };
	
