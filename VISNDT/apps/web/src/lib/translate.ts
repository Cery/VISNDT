/**
 * Simple translation map for category names and other common UI strings
 * that come from the API/database in English.
 *
 * Categories are created in the admin panel and stored in the database.
 * This map translates known English category names to Chinese for display.
 */

const CATEGORY_NAME_MAP: Record<string, string> = {
  // Common industrial inspection categories
  'Industrial Endoscopes': '工业内窥镜',
  'Industrial Endoscope': '工业内窥镜',
  'Measurement Systems': '测量系统',
  'Measurement System': '测量系统',
  'Inspection Cameras': '检测相机',
  'Inspection Camera': '检测相机',
  'Ultrasonic Testing': '超声检测',
  'Ultrasonic Testing Equipment': '超声检测设备',
  'Radiographic Testing': '射线检测',
  'Radiographic Testing Equipment': '射线检测设备',
  'Magnetic Particle Testing': '磁粉检测',
  'Penetrant Testing': '渗透检测',
  'Eddy Current Testing': '涡流检测',
  'Visual Inspection': '视觉检测',
  'Visual Inspection Equipment': '视觉检测设备',
  'Pipe Crawlers': '管道爬行器',
  'Pipe Crawler': '管道爬行器',
  'Borescopes': '内窥镜',
  'Borescope': '内窥镜',
  'Microscopes': '显微镜',
  'Microscope': '显微镜',
  'Thermal Imagers': '热成像仪',
  'Thermal Imager': '热成像仪',
  'Thickness Gauges': '测厚仪',
  'Thickness Gauge': '测厚仪',
  'Hardness Testers': '硬度计',
  'Hardness Tester': '硬度计',
  'Weld Inspection': '焊缝检测',
  'Surface Inspection': '表面检测',
  'Composite Inspection': '复合材料检测',
  'Pipeline Inspection': '管道检测',
  'Aerospace Inspection': '航空航天检测',
  'Automotive Inspection': '汽车检测',
  'Electronics Inspection': '电子检测',
  'Manufacturing Inspection': '制造检测',
  'Other': '其他',
};

/**
 * Translate a category name from English to Chinese.
 * Returns the original name if no translation is found.
 */
export function translateCategoryName(name: string): string {
  return CATEGORY_NAME_MAP[name] ?? name;
}