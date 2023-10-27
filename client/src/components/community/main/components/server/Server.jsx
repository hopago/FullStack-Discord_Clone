import ServerList from './components/card/ServerList';
import Hero from './components/hero/Hero';
import InfoLetters from './components/infoLetters/InfoLetters';
import './scss/server.scss';

const Server = () => {
  return (
    <div className="community-server-base">
      <div className="wrapper">
        <div className="viewWrapper">
          <Hero />
          <section className="serverList">
            <h2>추천 커뮤니티</h2>
            <ServerList />
          </section>
        </div>
        <footer>
          <InfoLetters />
        </footer>
      </div>
    </div>
  )
}

export default Server
