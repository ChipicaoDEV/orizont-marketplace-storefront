import { listBanners } from "@lib/data/banners"
import HeroCarousel from "./carousel"

const Hero = async () => {
  const banners = await listBanners()

  return <HeroCarousel slides={banners} />
}

export default Hero
