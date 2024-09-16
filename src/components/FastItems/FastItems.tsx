import Link from "next/link";
import Image from "next/image";
import { FastItem } from "@/types/FastItems";

const fastData: FastItem[] = [
  {
    avatar: "/images/products/s1.png",
    name: "Mandi",
    text: "Arabian Dish",
    time: 12,
  
  },
  {
    avatar: "/images/products/s3.png",
    name: "Matghooth",
    text: "Arabian Dish",
    time: 12,
 
  },
  {
    avatar: "/images/products/s2.png",
    name: "Kunafah",
    text: "Arabian Dish",
    time: 12,
 
  },
];

const FastItems = () => {
  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white py-6 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
      <h4 className="mb-6 px-7.5 text-xl font-semibold text-black dark:text-white">
       Fast Selling Items
      </h4>

      <div>
        {fastData.map((item, key) => (
          <Link
            href="/"
            className="flex items-center gap-5 px-7.5 py-3 hover:bg-gray-3 dark:hover:bg-meta-4"
            key={key}
          >
            <div className="relative h-14 w-14 rounded-full">
              <Image
                width={56}
                height={56}
                src={item.avatar}
                alt="User"
                style={{
                  width: "auto",
                  height: "auto",
                }}
              />
     
            </div>

            <div className="flex flex-1 items-center justify-between">
              <div>
                <h5 className="font-medium text-black dark:text-white">
                  {item.name}
                </h5>
                <p>
                  <span className="text-sm text-black dark:text-white">
                    {item.text}
                  </span>
                  <span className="text-xs"> . {item.time} min</span>
                </p>
              </div>
           
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default FastItems;
