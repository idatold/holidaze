import { Link } from "react-router-dom";
import mapImg from "@/assets/404-map.png";

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="mx-auto max-w-3xl rounded-[5px] bg-[#FEF5E4] p-8 shadow-md text-center">
        {/* 404 headline */}
        <h1 className="font-higuen text-ocean text-6xl sm:text-7xl">404</h1>

        {/* subhead */}
        <p className="mt-3 text-[#006492] text-xl font-semibold leading-tight font-arsenal">
          You’ve wandered off<br className="hidden sm:block" /> the map!
        </p>

        {/* tiny link above the image */}
        <div className="mt-4">
          <Link
            to="/venues"
            className="text-[#006492] text-[12px] underline hover:no-underline"
          >
            Go back to our venues
          </Link>
        </div>

        {/* illustration */}
        <img
          src={mapImg}
          alt="A little island with a map marked with an X"
          className="mx-auto mt-4 max-w-[720px] w-full h-auto select-none"
          draggable="false"
        />
      </div>
    </div>
  );
}
