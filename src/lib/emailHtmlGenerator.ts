
import type { Block, BlockType, ColumnData } from '../modules/marketing/pages/editor/editorTypes';

const BASE_CSS = `
    /* Reset */
    body { margin: 0; padding: 0; min-width: 100%; background-color: #F3F4F6; }
    table { border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    td { padding: 0; vertical-align: top; }
    img { border: 0; -ms-interpolation-mode: bicubic; display: block; }
    a { text-decoration: none; }
    
    /* Structure */
    .wrapper { width: 100%; table-layout: fixed; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    .webkit { max-width: 600px; margin: 0 auto; }
    .outer { margin: 0 auto; width: 100%; max-width: 600px; }
    
    /* Responsive */
    @media only screen and (max-width: 480px) {
        .full-width { width: 100% !important; max-width: 100% !important; }
        .stack { display: block !important; width: 100% !important; max-width: 100% !important; padding-left: 0 !important; padding-right: 0 !important; }
        .mobile-center { text-align: center !important; }
        .mobile-img { width: 100% !important; height: auto !important; }
        .btn { width: 100% !important; display: block !important; text-align: center !important; }
        .spacer { height: 20px !important; }
        .col-pad { padding-left: 20px !important; padding-right: 20px !important; }
    }
`;

const generateBlockHtml = (block: Block): string => {
  const s = block.styles;
  const c = block.content;

  // Container Styles
  const containerStyle = `
      padding-top: ${s.paddingTop}px; 
      padding-bottom: ${s.paddingBottom}px; 
      padding-left: ${s.paddingLeft}px; 
      padding-right: ${s.paddingRight}px; 
      background-color: ${s.backgroundColor || 'transparent'};
      text-align: ${s.textAlign};
  `;

  // Font Styles
  const fontStyle = `
      font-family: ${s.fontFamily || 'sans-serif'}; 
      color: ${s.color || '#000000'}; 
      font-size: ${s.fontSize || 16}px; 
      line-height: ${s.lineHeight || 1.5}; 
      font-weight: ${s.fontWeight || 'normal'};
  `;

  // Helper: Render Column Internal Content
  const renderColumnInternal = (col: ColumnData) => {
      const align = col.textAlign || 'left';
      let contentHtml = '';

      if (col.hasImage && col.imageSrc) {
          contentHtml += `
            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                    <td align="${align}" style="padding-bottom: 12px;">
                        <img src="${col.imageSrc}" alt="${col.imageAlt || ''}" width="${col.imageWidth ? `${col.imageWidth}%` : '100%'}" style="max-width: 100%; height: auto; border-radius: ${col.borderRadius || 0}px; display: inline-block;" class="mobile-img" />
                    </td>
                </tr>
            </table>
          `;
      }

      if (col.headerText) {
          contentHtml += `<h3 style="margin: 0 0 8px 0; font-size: 18px; font-weight: bold; color: #111111; text-align: ${align}; font-family: ${s.fontFamily};">${col.headerText}</h3>`;
      }

      if (col.price) {
          contentHtml += `<p style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold; color: #16a34a; text-align: ${align}; font-family: monospace;">${col.price}</p>`;
      }

      if (col.bodyText) {
          contentHtml += `<p style="margin: 0 0 12px 0; font-size: 14px; line-height: 1.5; color: #555555; text-align: ${align}; font-family: ${s.fontFamily};">${col.bodyText.replace(/\n/g, '<br/>')}</p>`;
      }

      if (col.hasButton) {
          contentHtml += `
            <table border="0" cellspacing="0" cellpadding="0" style="margin: ${align === 'center' ? '0 auto' : '0'};">
                <tr>
                    <td align="center" bgcolor="${col.buttonColor || '#3B82F6'}" style="border-radius: 4px;">
                        <a href="${col.buttonLink}" target="_blank" style="font-size: 14px; font-family: ${s.fontFamily}; color: ${col.buttonTextColor || '#ffffff'}; text-decoration: none; padding: 10px 20px; display: inline-block; font-weight: bold;">
                            ${col.buttonText}
                        </a>
                    </td>
                </tr>
            </table>
          `;
      }

      return contentHtml;
  };

  // Switch on Type
  switch (block.type) {
    case 'header':
      return `
        <tr>
          <td align="${s.textAlign}" style="${containerStyle}">
            <${c.tag || 'h2'} style="margin: 0; font-size: ${s.fontSize}px; color: ${s.color}; font-family: ${s.fontFamily}; font-weight: ${s.fontWeight}; line-height: 1.2;">
                ${c.text}
            </${c.tag || 'h2'}>
          </td>
        </tr>
      `;

    case 'text':
      return `
        <tr>
          <td align="${s.textAlign}" style="${containerStyle} ${fontStyle}">
            ${c.text}
          </td>
        </tr>
      `;

    case 'button':
      return `
        <tr>
          <td align="${s.textAlign}" style="${containerStyle}">
            <table border="0" cellspacing="0" cellpadding="0" class="${s.fullWidth ? 'full-width' : ''}" style="${s.fullWidth ? 'width: 100%;' : ''}">
              <tr>
                <td align="center" bgcolor="${s.backgroundColor}" style="border-radius: ${s.borderRadius}px;">
                  <a href="${c.link || '#'}" class="btn" target="_blank" style="display: inline-block; padding: 12px 24px; font-family: ${s.fontFamily}; font-size: 16px; color: ${s.color}; text-decoration: none; font-weight: bold;">
                    ${c.text}
                  </a>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      `;

    case 'image':
      return `
        <tr>
          <td align="center" style="${containerStyle}">
            <img src="${c.src}" alt="${c.alt || 'Image'}" width="${s.width?.replace('%', '') || '600'}" style="width: ${s.width || '100%'}; max-width: 100%; height: auto; border-radius: ${s.borderRadius}px; display: block;" class="full-width" />
          </td>
        </tr>
      `;

    case 'divider':
      return `
        <tr>
          <td style="${containerStyle}">
             <div style="border-top: ${s.borderWidth}px ${s.borderStyle} ${s.borderColor}; width: ${s.width || '100%'}; margin: 0 auto;"></div>
          </td>
        </tr>
      `;

    case 'spacer':
      return `
        <tr>
          <td style="height: ${s.height}px; font-size: 0; line-height: 0; background-color: ${s.backgroundColor || 'transparent'};" class="spacer">&nbsp;</td>
        </tr>
      `;

    case 'social':
      const icons = (c.socials || [])
        .filter((n: any) => n.enabled)
        .map((n: any) => `
            <a href="${n.url}" target="_blank" style="text-decoration: none; display: inline-block; margin: 0 ${s.gap ? s.gap / 2 : 4}px;">
                <img src="https://cdn-icons-png.flaticon.com/512/145/145802.png" alt="${n.platform}" width="${s.iconSize}" height="${s.iconSize}" class="social-icon" style="display: block; border: 0;" />
            </a>
        `).join('');
      return `
        <tr>
          <td align="${s.textAlign}" style="${containerStyle}">
            ${icons}
          </td>
        </tr>
      `;

    case 'html':
      return `
        <tr>
          <td style="${containerStyle}">
            ${c.html}
          </td>
        </tr>
      `;

    case '2-col': {
        const cols = c.columns || [];
        return `
        <tr>
            <td style="${containerStyle} padding-left: 0; padding-right: 0;">
                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                        <td valign="top" width="50%" class="stack" style="padding-left: ${s.paddingLeft}px; padding-right: ${s.gap ? s.gap / 2 : 8}px; padding-bottom: 10px;">
                            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: ${cols[0]?.backgroundColor || 'transparent'}; border-radius: ${cols[0]?.borderRadius || 0}px; border: ${cols[0]?.border || 'none'};">
                                <tr>
                                    <td style="padding: ${cols[0]?.padding || 10}px;">
                                        ${renderColumnInternal(cols[0])}
                                    </td>
                                </tr>
                            </table>
                        </td>
                        <td valign="top" width="50%" class="stack" style="padding-left: ${s.gap ? s.gap / 2 : 8}px; padding-right: ${s.paddingRight}px; padding-bottom: 10px;">
                             <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: ${cols[1]?.backgroundColor || 'transparent'}; border-radius: ${cols[1]?.borderRadius || 0}px; border: ${cols[1]?.border || 'none'};">
                                <tr>
                                    <td style="padding: ${cols[1]?.padding || 10}px;">
                                        ${renderColumnInternal(cols[1])}
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        `;
    }

    case '3-col': {
        const cols = c.columns || [];
        // Note: 3 columns in a table row is standard, mobile will stack them using class="stack"
        return `
        <tr>
            <td style="${containerStyle} padding-left: 0; padding-right: 0;">
                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                        <td valign="top" width="33.33%" class="stack" style="padding-left: ${s.paddingLeft}px; padding-right: ${s.gap ? s.gap / 3 : 4}px; padding-bottom: 10px;">
                             <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: ${cols[0]?.backgroundColor || 'transparent'}; border-radius: ${cols[0]?.borderRadius || 0}px; border: ${cols[0]?.border || 'none'};">
                                <tr>
                                    <td style="padding: ${cols[0]?.padding || 10}px;">
                                        ${renderColumnInternal(cols[0])}
                                    </td>
                                </tr>
                            </table>
                        </td>
                        <td valign="top" width="33.33%" class="stack" style="padding-left: ${s.gap ? s.gap / 3 : 4}px; padding-right: ${s.gap ? s.gap / 3 : 4}px; padding-bottom: 10px;">
                              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: ${cols[1]?.backgroundColor || 'transparent'}; border-radius: ${cols[1]?.borderRadius || 0}px; border: ${cols[1]?.border || 'none'};">
                                <tr>
                                    <td style="padding: ${cols[1]?.padding || 10}px;">
                                        ${renderColumnInternal(cols[1])}
                                    </td>
                                </tr>
                            </table>
                        </td>
                        <td valign="top" width="33.33%" class="stack" style="padding-left: ${s.gap ? s.gap / 3 : 4}px; padding-right: ${s.paddingRight}px; padding-bottom: 10px;">
                              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: ${cols[2]?.backgroundColor || 'transparent'}; border-radius: ${cols[2]?.borderRadius || 0}px; border: ${cols[2]?.border || 'none'};">
                                <tr>
                                    <td style="padding: ${cols[2]?.padding || 10}px;">
                                        ${renderColumnInternal(cols[2])}
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        `;
    }

    default:
      return '';
  }
};

export const generateEmailHtml = (blocks: Block[], canvasBg: string = '#ffffff'): string => {
  const blocksHtml = blocks.map(generateBlockHtml).join('');

  return `
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Email Template</title>
  <style type="text/css">
    ${BASE_CSS}
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #F3F4F6;">
  <center class="wrapper" style="width: 100%; table-layout: fixed; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; background-color: #F3F4F6;">
    <div class="webkit" style="max-width: 600px; margin: 0 auto;">
      <table class="outer" align="center" style="border-spacing: 0; font-family: sans-serif; color: #333333; margin: 0 auto; width: 100%; max-width: 600px; background-color: ${canvasBg}; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
        ${blocksHtml}
      </table>
    </div>
  </center>
</body>
</html>
  `;
};
