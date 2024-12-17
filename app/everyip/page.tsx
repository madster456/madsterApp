/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import Footer from "@/components/custom/Footer";
import Scrollbar from "@/components/everyip/Scrollbar";
import { useState, useEffect, useCallback } from "react";
import { MAX_IPv6, numberToIPv6 } from "@/lib/everyip/ip-utils";
import BigNumber from "bignumber.js";
import SearchBar from "@/components/everyip/SearchBar";
import StatsPanel from "@/components/everyip/StatsPanel";
import { AddressService } from "@/lib/everyip/address-service";
import { FavoriteAddress, FavoritesManager } from "@/lib/everyip/favorites";
import FavoritesButton from "@/components/everyip/FavoritesButton";
import AnimatedStatsPanel from "@/components/everyip/AnimatedStatsPanel";

const ADDRESSES_PER_PAGE = 100;
const WHEEL_DELTA = 5;

export default function EveryIP() {
  const [virtualPosition, setVirtualPosition] = useState<BigNumber>(
    new BigNumber(0)
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [visibleAddresses, setVisibleAddresses] = useState<
    Array<{ position: string; ip: string }>
  >([]);
  const [isShowingFavorites, setIsShowingFavorites] = useState(false);
  const [favorites, setFavorites] = useState<FavoriteAddress[]>([]);

  const handleWheel = useCallback(
    (e: Event) => {
      if (!(e instanceof WheelEvent) || isSearching || isShowingFavorites)
        return;
      e.preventDefault();
      const delta = e.deltaY > 0 ? WHEEL_DELTA : -WHEEL_DELTA;
      const newPosition = virtualPosition.plus(delta);

      if (
        newPosition.isGreaterThanOrEqualTo(0) &&
        newPosition.isLessThanOrEqualTo(MAX_IPv6)
      ) {
        setVirtualPosition(newPosition);
      }
    },
    [virtualPosition, isSearching, isShowingFavorites]
  );

  useEffect(() => {
    const tableContainer = document.querySelector(".table-container");
    if (tableContainer) {
      tableContainer.addEventListener("wheel", handleWheel, { passive: false });
      return () => tableContainer.removeEventListener("wheel", handleWheel);
    }
  }, [handleWheel]);

  useEffect(() => {
    if (searchQuery) {
      setIsSearching(true);
      try {
        const position = AddressService.searchAddress(searchQuery);
        setVirtualPosition(position);
        setIsSearching(false);
      } catch {
        setIsSearching(false);
      }
    } else {
      setIsSearching(false);
    }
  }, [searchQuery]);

  // Separate effect for updating visible addresses
  useEffect(() => {
    if (isShowingFavorites) {
      const favorites = FavoritesManager.getFavorites();
      setVisibleAddresses(
        favorites.map((fav) => ({
          position: fav.position,
          ip: fav.address,
        }))
      );
    } else {
      const addresses = [];
      for (let i = 0; i < ADDRESSES_PER_PAGE; i++) {
        const position = virtualPosition.plus(i);
        if (position.isLessThanOrEqualTo(MAX_IPv6)) {
          addresses.push({
            position: position.toFixed(0).padStart(39, "0"),
            ip: numberToIPv6(position),
          });
        }
      }
      setVisibleAddresses(addresses);
    }
  }, [virtualPosition, isShowingFavorites]);

  useEffect(() => {
    setFavorites(FavoritesManager.getFavorites());
  }, [isShowingFavorites]);

  const highlightText = (text: string) => {
    if (!searchQuery) return text;

    const parts = text.split(new RegExp(`(${searchQuery})`, "gi"));
    return parts.map((part, i) =>
      part.toLowerCase() === searchQuery.toLowerCase() ? (
        <span key={i} className="bg-yellow-200">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const getAddressInfo = (ip: string) => {
    try {
      const info = AddressService.getAddressInfo(ip);
      if (!info) return null;

      return {
        type: info.type,
        description: info.description,
        isPopularService: info.isPopularService,
        isSpecialRange: info.isSpecialRange,
        category: info.category,
        scope: info.scope,
      };
    } catch (error) {
      console.error("Error getting address info:", error);
      return null;
    }
  };

  const toggleFavorite = (address: string, position: string) => {
    if (FavoritesManager.isFavorite(address)) {
      FavoritesManager.removeFavorite(address);
    } else {
      FavoritesManager.addFavorite({ address, position });
    }
    setFavorites(FavoritesManager.getFavorites());
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <main className="flex flex-1 overflow-hidden">
        <div className="flex-1 p-6 flex flex-col">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">
            Every IPv6 Address
            <FavoritesButton
              isShowingFavorites={isShowingFavorites}
              onToggle={() => setIsShowingFavorites(!isShowingFavorites)}
            />
          </h1>
          <AnimatedStatsPanel
            virtualPosition={virtualPosition}
            onJump={setVirtualPosition}
            isVisible={!isShowingFavorites}
          />
          <SearchBar
            onSearch={setVirtualPosition}
            onQueryChange={setSearchQuery}
          />
          <div className="table-container flex-1 bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full table-fixed">
              <colgroup>
                <col className="w-[400px]" />
                <col />
              </colgroup>
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left p-3 font-semibold text-gray-600">
                    Position
                  </th>
                  <th className="text-left p-3 font-semibold text-gray-600">
                    IPv6 Address
                  </th>
                </tr>
              </thead>
              <tbody>
                {isShowingFavorites && visibleAddresses.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="p-8 text-center text-gray-500">
                      No favorites yet. Click the star icon next to any address
                      to add it to your favorites.
                    </td>
                  </tr>
                ) : (
                  visibleAddresses.map(({ position, ip }) => (
                    <tr
                      key={position}
                      className="border-t border-gray-200 hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="p-3 font-mono text-sm">
                        {(() => {
                          if (position === "0".repeat(39)) {
                            return (
                              <>
                                <span className="text-gray-500">
                                  {"0".repeat(38)}
                                </span>
                                <span className="text-gray-900 font-bold">
                                  0
                                </span>
                              </>
                            );
                          }
                          const significantDigits = position.replace(
                            /^0+/,
                            ""
                          ).length;
                          const leadingZeros = 39 - significantDigits;
                          return (
                            <>
                              <span className="text-gray-500">
                                {"0".repeat(leadingZeros)}
                              </span>
                              <span className="text-gray-900 font-bold">
                                {position.slice(-significantDigits)}
                              </span>
                            </>
                          );
                        })()}
                      </td>
                      <td className="p-3 font-mono text-sm relative">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleFavorite(ip, position)}
                            className="p-1 rounded hover:bg-gray-100"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill={
                                FavoritesManager.isFavorite(ip)
                                  ? "#EAB308"
                                  : "none"
                              }
                              stroke="currentColor"
                              className="w-4 h-4"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                              />
                            </svg>
                          </button>
                          <div>{highlightText(ip)}</div>
                        </div>
                        {(() => {
                          const info = getAddressInfo(ip);
                          if (info) {
                            return (
                              <div
                                className={`text-xs mt-1 ${
                                  info.isPopularService
                                    ? "text-green-600"
                                    : "text-blue-600"
                                }`}
                              >
                                {info.type}: {info.description}
                              </div>
                            );
                          }
                          return null;
                        })()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        {!isShowingFavorites && (
          <div className="w-4 bg-gray-200">
            <Scrollbar
              maxPosition={MAX_IPv6}
              virtualPosition={virtualPosition}
              onScroll={setVirtualPosition}
            />
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
