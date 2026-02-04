import { ScrollShadow, Button, Skeleton } from "@heroui/react";
import { XIcon } from "@/components/icons";
import { useFetchCategories } from "@/data/supabase/useFetchCategories";

interface CategoriesProps {
    activeCategories: string[];
    setActiveCategories: (categories: string[]) => void;
}

export default function Categories({
    activeCategories,
    setActiveCategories,
}: CategoriesProps) {
    const { categories, loading, error } = useFetchCategories();

    if (error) {
        return (
            <div className="w-full px-4">
                <p className="text-center text-danger">
                    Failed to load categories
                </p>
            </div>
        );
    }

    return (
        <div className="w-full px-4">
            <p className="text-left md:text-center mb-2 font-semibold">
                Filter Products
            </p>

            <ScrollShadow
                orientation="horizontal"
                className="w-full scroll-smooth p-2"
            >
                <div className="flex justify-center items-center gap-5 sm:gap-10 min-w-max mx-auto snap-x snap-mandatory">
                    {loading
                        ? // Show skeletons while loading
                          Array.from({ length: 5 }).map((_, index) => (
                              <Skeleton
                                  key={index}
                                  className="w-24 h-10 rounded-full flex-shrink-0"
                              />
                          ))
                        : // Render real categories
                          categories.map((item) => {
                              const isActive = activeCategories.includes(
                                  item.category_name,
                              );

                              return (
                                  <div
                                      key={item.category_id}
                                      className="flex items-center flex-shrink-0"
                                  >
                                      <Button
                                          endContent={
                                              isActive ? (
                                                  <XIcon className="size-5" />
                                              ) : null
                                          }
                                          aria-label={item.category_name}
                                          radius="full"
                                          color={
                                              isActive ? "success" : "default"
                                          }
                                          onPress={() => {
                                              if (isActive) {
                                                  setActiveCategories(
                                                      activeCategories.filter(
                                                          (n) =>
                                                              n !==
                                                              item.category_name,
                                                      ),
                                                  );
                                              } else {
                                                  setActiveCategories([
                                                      ...activeCategories,
                                                      item.category_name,
                                                  ]);
                                              }
                                          }}
                                      >
                                          {item.category_name}
                                      </Button>
                                  </div>
                              );
                          })}
                </div>
            </ScrollShadow>
        </div>
    );
}
