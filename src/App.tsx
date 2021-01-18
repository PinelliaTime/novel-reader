import PageRouter from './router';
require('@/utils/rewrite');

function App(porps: any) {
  return (
    <div className="App">
      <PageRouter />
    </div>
  );
}

export default App;
