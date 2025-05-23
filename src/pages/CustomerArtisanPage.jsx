import { useParams } from "react-router";
import ArtisanProfile from "./ArtisanProfilePage";

const cutomerArtisanPage = () => {
  const { artisanId } = useParams();
  return (
    <>
      <ArtisanProfile artisanId={artisanId} isOwnProfile={false} isCustomer />
    </>
  );
};

export default cutomerArtisanPage;
