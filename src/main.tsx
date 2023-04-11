import ReactDOM from 'react-dom/client';
import { EditorPage } from '@/presenter/pages';
import './style.scss';

const target = document.querySelector('#root') as HTMLElement;
const reactRoot = ReactDOM.createRoot(target);

reactRoot.render(
	<EditorPage />
);
