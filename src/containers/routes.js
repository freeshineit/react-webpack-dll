import App from './App';
import {Home} from './children';

const routes = [
	{
		component: App,
		routes: [
			{ 
				path: '/',
				exact: true,
				component: Home
            }
            // {
			// 	path: '/data',
			// 	component: Data
			// }
		]
	}
]

export default routes;
