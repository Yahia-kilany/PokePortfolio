import { useEffect, useState, useMemo } from "react";
import {
  fetchItemList,
  fetchItemDetail,
  type ItemListEntry,
  type ItemDetail,
} from "../services/pokeApi";
import { Search, ChevronDown } from "lucide-react";
import "./Items.css";

const PAGE_SIZE = 20;

export default function Items() {
  const [items, setItems] = useState<ItemListEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function init() {
      try {
        const res = await fetchItemList(0, PAGE_SIZE);
        setItems(res.results);
        setTotalCount(res.count);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  const loadMore = async () => {
    if (loadingMore) return;
    setLoadingMore(true);
    try {
      const nextOffset = items.length;
      const res = await fetchItemList(nextOffset, PAGE_SIZE);
      setItems((prev) => [...prev, ...res.results]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingMore(false);
    }
  };

  const filteredItems = useMemo(() => {
    return items.filter((item) =>
      item.name.includes(searchQuery.toLowerCase()),
    );
  }, [items, searchQuery]);

  if (loading) return <div className="loading">Loading items...</div>;

  return (
    <div className="items-page">
      <div className="items-header">
        <h1>Pokemon Items</h1>
        <div className="search-wrapper">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            placeholder="Search loaded items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      <div className="items-grid">
        {filteredItems.map((item) => (
          <ItemCard key={item.name} name={item.name} />
        ))}
      </div>

      {items.length < totalCount && (
        <button
          className="load-more-button"
          onClick={loadMore}
          disabled={loadingMore}
        >
          {loadingMore ? (
            "Loading..."
          ) : (
            <>
              <ChevronDown size={20} />
              Load More Items
            </>
          )}
        </button>
      )}
    </div>
  );
}

function ItemCard({ name }: { name: string }) {
  const [detail, setDetail] = useState<ItemDetail | null>(null);

  useEffect(() => {
    fetchItemDetail(name).then(setDetail);
  }, [name]);

  if (!detail) return <div className="item-card-skeleton"></div>;

  const description =
    detail.flavor_text_entries.find((e) => e.language.name === "en")
      ?.flavor_text || "No description available.";

  return (
    <div className="item-card">
      <div className="item-sprite-bg">
        <img src={detail.sprites.default} alt={name} />
      </div>
      <div className="item-info">
        <h3>{name.replace("-", " ")}</h3>
        <span className="item-category">
          {detail.category.name.replace("-", " ")}
        </span>
        <p className="item-description">{description}</p>
        {detail.cost > 0 && <span className="item-cost">${detail.cost}</span>}
      </div>
    </div>
  );
}
