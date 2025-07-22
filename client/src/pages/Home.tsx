import BrandInfo from "../components/home/BrandInfo";
import Carousel from "../components/home/Carousel";
import SearchBar from "../components/home/SearchBar";

function Home() {
  return (
    <div>
      <SearchBar />
      <Carousel />
      <BrandInfo />

      <section className="bg-primary grid grid-cols-2 md:grid-cols-4 gap-6 my-10 px-6 text-center">
        <div>
          <img
            src="Explorer.png"
            alt="explorer"
            className="mx-auto mb-2 h-12"
          />
          <p>
            Explorer les parfums
            <br />
            Découvrez des senteurs qui vous correspondent.
          </p>
        </div>
        <div>
          <img src="Quizz.png" alt="quizz" className="mx-auto mb-2 h-12" />
          <p>
            Faites le quizz
            <br />
            Des questions simples pour un résultat personnalisé.
          </p>
        </div>
        <div>
          <img src="Avis.png" alt="avis" className="mx-auto mb-2 h-12" />
          <p>
            Exprimez-vous
            <br />
            Donnez votre avis et échangez.
          </p>
        </div>
        <div>
          <img src="Fiche.png" alt="fiche" className="mx-auto mb-2 h-12" />
          <p>
            Consulter les fiches
            <br />
            Accédez aux notes, familles et avis détaillés.
          </p>
        </div>
      </section>
    </div>
  );
}

export default Home;
