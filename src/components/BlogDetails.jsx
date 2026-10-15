import { useEffect, useState } from "react";
import { Row, Card, Button, Spin, Empty } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { supabase } from "../supabaseClient";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const BlogDetails = () => {
  const navigate = useNavigate();
  const { link } = useParams();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  /* =========================================================
     FETCH BLOG BY SLUG
  ========================================================= */

  useEffect(() => {
    const fetchBlog = async () => {
      setLoading(true);
      setNotFound(false);

      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .eq("link", link)
        .eq("published", true)
        .maybeSingle();

      if (error) {
        console.error("Failed to load blog:", error);
        setNotFound(true);
      } else if (!data) {
        setNotFound(true);
      } else {
        setBlog(data);
      }
      setLoading(false);
    };

    if (link) fetchBlog();
  }, [link]);

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  /* =========================================================
     NOT FOUND
  ========================================================= */

  if (notFound || !blog) {
    return (
      <>
        <Helmet>
          <title>Blog Not Found | PNG HSA</title>
        </Helmet>
        <div className="mx-auto max-w-2xl px-4 py-20">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="This blog post could not be found or is no longer available."
          >
            <Button
              type="primary"
              onClick={() => navigate("/blogs")}
              className="rounded-lg! border-none! bg-amber-500! hover:bg-amber-600!"
            >
              Back to Blogs
            </Button>
          </Empty>
        </div>
      </>
    );
  }

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <>
      <Helmet>
        <title>{blog.title} | PNG HSA</title>
        <meta name="description" content={blog.excerpt || blog.title} />
        <meta property="og:title" content={blog.title} />
        <meta property="og:description" content={blog.excerpt || ""} />
        {blog.image_url && <meta property="og:image" content={blog.image_url} />}
        <link
          rel="canonical"
          href={`https://www.pngwuhanstudents.netlify.app/blogs/${blog.link}`}
        />
      </Helmet>

      <div className="bg-gray-100">
        <motion.div variants={fadeUp} className="py-10">
          <h2 className="text-4xl text-center font-bold">Blogs and News</h2>
          <p className="text-gray-400 text-center text-sm mt-4">
            Updates | News | Announcements
          </p>
        </motion.div>

        <Row gutter={0} justify={"center"}>
          <Card className="lg:max-w-5xl mx-4! w-full! mb-10! p-0! m-0!">
            <Button
              className="border-0! text-amber-600!"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft />
            </Button>

            {blog.image_url && (
              <div className="w-full! lg:h-120 object-cover overflow-hidden">
                <img
                  src={blog.image_url}
                  alt={blog.title}
                  className="object-cover object-center w-full h-full"
                />
              </div>
            )}

            <div className="lg:flex justify-between items-center">
              <h2 className="text-xl py-4 font-bold">{blog.title}</h2>
              {blog.publish_date && (
                <p className="bg-amber-100 p-2 rounded-lg w-fit mb-4 md:mb-4 lg:mb-4">
                  {blog.publish_date}
                </p>
              )}
            </div>

            {blog.author && (
              <p className="text-gray-400 mb-4">By: {blog.author}</p>
            )}

            <p style={{ whiteSpace: "pre-wrap" }}>{blog.content}</p>
          </Card>
        </Row>
      </div>
    </>
  );
};

export default BlogDetails;