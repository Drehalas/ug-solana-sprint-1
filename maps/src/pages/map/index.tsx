import Head from 'next/head'

import Map from '#components/Map'

const MapPage = () => (
  <div>
    <Head>
      <title> Unify Giving Map Sample | New leaflet mapping Project with next.js and typescript 🤩</title>
      <meta
        property="og:title"
        content=" Unify Giving Map Sample | New leaflet mapping Project with next.js and typescript 🤩"
        key="title"
      />
      <meta
        name="description"
        content="next-leaflet-starter-typescript is an extensible next.js starter template for the leaflet-maps-react plugin. Written in typescript,
      visually enhanced by tailwind and lucide-react icons."
      />
    </Head>
    <Map />
  </div>
)

export default MapPage
