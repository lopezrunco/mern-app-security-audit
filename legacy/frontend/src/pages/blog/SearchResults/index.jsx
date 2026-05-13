import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import React from "react";

import { DARK } from "../../../utils/blog-card-types";

import { Title } from "../../../components/Title";
import { Breadcrumbs } from "../../../components/Breadcrumbs";
import { PostCard } from "../../Home/components/PostCard";
import { SearchArticles } from "../../../components/SearchArticles";
import { CategoriesList } from "../../../components/CategoriesList";
import { LatestPostsAside } from "../../../components/LatestPostsAside";
import { TagsList } from "../../../components/TagsList";

export const SearchResults = () => {
  const location = useLocation();
  const searchResults = location.state?.results || [];

  return (
    <React.Fragment>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
        viewport={{ once: true }}
      >
        <Breadcrumbs location={"Resultados de la búsqueda"} />
      </motion.div>
      <section className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.3 }}
          viewport={{ once: true }}
        >
          <Title
            title="Resultados"
            subtitle={`Artículos encontrados: ${searchResults.length}`}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4 }}
          viewport={{ once: true }}
        >
          <div className="row">
            <div className="col-lg-9">
              <div className="row">
                {searchResults.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    colClass={"col-lg-12"}
                    btnClass="button button-light-outline"
                    cardType={DARK}
                  />
                ))}
              </div>
            </div>
            <div className="col-lg-3">
              <div className="mb-5">
                <SearchArticles />
              </div>
              <CategoriesList />
              <LatestPostsAside numbOfItems="3" />
              <TagsList />
            </div>
          </div>
        </motion.div>
      </section>
    </React.Fragment>
  );
};
