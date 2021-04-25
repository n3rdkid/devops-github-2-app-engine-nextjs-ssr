import Head from 'next/head'
import { db } from "../config";
export default function Home({ data, error }) {
  return (
    <div>
      <Head>
        <title>Deploying Next App SSR</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {console.log("DATA", data, error)}
      {error && <p>Oops something went wrong!</p>}
      {data?.map(collections => {
        return <div key={collections.title}>
          <h2>{collections.title}</h2>
          <div style={{display:"flex",gap:"8px",flexWrap:"wrap"}}>
            {collections?.data?.map(product=>{
              return <div style={{border:"1px solid red",flex:"0 0 18%",}} key={`item-${product.id}`}>
                <img width="100%" height="320px"style={{objectFit:"cover"}} src={product?.imageUrl}/>
                <div style={{display:"flex",alignItems:"center",padding:"8px 16px"}}>
                <p style={{flexBasis:"0 0 75%",marginRight:"auto"}}>{product?.name}</p>
                <h3>Rs.{product?.price}</h3>
                </div>
              </div>
            })}
           
          </div>
        </div>
      }
      )
      }
    </div>)
}


export async function getStaticProps(context) {
  let mappedData = []
  try {
    const response = db.collection('collections')
    const data = await response.get();
    mappedData = convertCollectionsSnapshotToMap(data);
    return {
      props: { data: mappedData },
    }
  }
  catch (e) {
    return {
      props: {
        data: null,
        error: e
      }
    }

  }

}
const convertCollectionsSnapshotToMap = collections => {
  const transformedCollection = collections.docs.map(doc => {
    const { title, items } = doc.data();
    return { id: doc.id, title, route: encodeURI(title.toLowerCase()), items };
  });
  return transformedCollection.reduce((accmulator, collection) => {
    accmulator.push({ title: collection.title, data: collection.items });
    return accmulator;
  }, []);

};

