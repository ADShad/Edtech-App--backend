exports.getBannerUrls = async (req, res) => {
    try {
        const urls = [
            "https://descriptionimagesioasis.s3.ap-south-1.amazonaws.com/Banner.PNG",
            "https://descriptionimagesioasis.s3.ap-south-1.amazonaws.com/Banner2.jpeg",
            "https://descriptionimagesioasis.s3.ap-south-1.amazonaws.com/Banner3.jpeg",
        ]
        res.status(200).json({ urls });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}