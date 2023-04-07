import ReactDOM from 'react-dom/client';
import { EditorPage } from '@/presenter/pages';
import './style.css';

const target = document.querySelector('#root') as HTMLElement;
const reactRoot = ReactDOM.createRoot(target);

reactRoot.render(
	<EditorPage />
);
