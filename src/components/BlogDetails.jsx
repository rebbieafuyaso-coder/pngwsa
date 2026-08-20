import { Row, Card, Button } from "antd";
import { BlogData } from "../data/data";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const BlogDetails = ({}) => {
  const navigate = useNavigate();
  const {link} = useParams();
  const blog = BlogData.find((blog) => blog.link === String(link));
  return(
    <div className="bg-gray-100">
      <motion.div variants={fadeUp} className="py-10">
        <h2 className="text-4xl text-center font-bold">Blogs and News</h2>
        <p className="text-gray-400 text-center text-sm mt-4">Updates | News | Announcements</p>
      </motion.div>
      <Row gutter={0} justify={"center"}>
        <Card className="lg:max-w-5xl mx-4! w-full! mb-10! p-0! m-0!">
          <Button className="border-0! text-amber-600!" onClick={() => {navigate(-1)}}><ArrowLeft /></Button>
          <div className="w-full! lg:h-120 object-cover overflow-hidden">
            <img src={blog.image} alt={blog.link} className="object-cover object-center w-full h-full" />
          </div>
          <div className="lg:flex justify-between items-center">
          <h2 className="text-xl py-4 font-bold">{blog.title}</h2>
            <p className="bg-amber-100 p-2 rounded-lg w-fit mb-4 md:mb-4 lg:mb-4"> <span className="">{blog.date}</span> <span className="">{blog.month.slice(0, 3)}</span> <span>{blog.year}</span></p>
          </div>
          <p className="text-gray-400 mb-4">By: {blog.author}</p>
          <p style={{ whiteSpace: "pre-wrap" }}>{blog.news}</p>
        </Card>
      </Row>
    </div>
  )
}

export default BlogDetails;