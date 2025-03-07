import _ from 'lodash';



function debounce(func: (...args: any[]) => any) {
	
	return _.debounce(func, 300);
}

function _delay<T extends (...args: any[]) => void>(func: T, wait = 300): (...args: Parameters<T>) => void {
	return (...args: Parameters<T>) => {
        _.delay(func, wait, ...args);
    };
}

function delay(func:(...args: any[]) => void){
	_delay(func)();
}

function sortByBooleanField<T extends Record<string, any>>(
	items: T[],
	field: keyof T,
  ): T[] {
	return [...items].sort((a, b) => {
	  const aValue = a[field] ?? false;
	  const bValue = b[field] ?? false;
	  return Number(bValue) - Number(aValue);
	});
  }



export { debounce, delay,sortByBooleanField};


	
