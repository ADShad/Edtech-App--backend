exports.testapi = async (req, res) => {
    try {
        res.status(200).json({ success: true, message: 'test api' });
    } catch (error) {
        console.log(error
        );
    }
}