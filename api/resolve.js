module.exports = async function handler(req, res) {
    const { url, platform } = req.query;

    if (!url) {
        return res.status(400).json({ error: "Vui lòng cung cấp đường link" });
    }

    try {
        // Bước 1: Máy chủ Vercel truy cập link rút gọn để lấy link dài thật
        const response = await fetch(url, {
            method: 'GET',
            redirect: 'follow',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
            }
        });

        let finalUrl = response.url;

        if (finalUrl.includes('shopee.vn')) {
            // Bước 2: Tự động gắn mã Affiliate của bạn vào link dài
            const MY_AFF_ID = "an_17355520340";
            const source = (platform === 'youtube') ? 'youtube' : 'facebook';
            
            const extraParams = `utm_source=${source}&utm_medium=affiliate&utm_campaign=exclusive_voucher&aff_id=${MY_AFF_ID}`;
            
            if (finalUrl.includes('?')) {
                finalUrl = finalUrl + '&' + extraParams;
            } else {
                finalUrl = finalUrl + '?' + extraParams;
            }

            // Bước 3: Chuyển thành link ép mở app
            const deepLink = finalUrl.replace(/^https?:\/\//, 'shopeevn://');
            
            return res.status(200).json({ deepLink: deepLink });
        } else {
            return res.status(400).json({ error: "Đây không phải là link Shopee hợp lệ." });
        }

    } catch (error) {
        return res.status(500).json({ error: "Không thể xử lý đường link này." });
    }
};
