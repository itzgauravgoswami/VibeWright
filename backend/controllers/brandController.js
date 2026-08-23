const brandProfileService = require('../services/repurposing/brandProfileService');

class BrandController {
  getProfile(req, res) {
    const profile = brandProfileService.getProfile();
    return res.status(200).json(profile);
  }

  updateProfile(req, res) {
    const updated = brandProfileService.updateProfile(req.body);
    return res.status(200).json(updated);
  }
}

module.exports = new BrandController();
