import Header from '../components/Header';
import { useIsMobile } from '../useIsMobile';

function InfoPage() {
  const isMobile = useIsMobile();

  const headerHeight = isMobile ? 57 : 69;

  const sections = [
    { id: 'tallas', label: 'Guía de tallas' },
    { id: 'devoluciones', label: 'Devoluciones' },
    { id: 'cuidado', label: 'Cuidado de la ropa' },
  ];

  function scrollToSection(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  const sectionStyle = {
    marginBottom: isMobile ? '56px' : '88px',
    scrollMarginTop: isMobile ? '120px' : '140px',
  };

  const sectionIndexStyle = {
    fontFamily: "'Anton', sans-serif",
    fontSize: isMobile ? '18px' : '22px',
    color: '#FFD500',
    margin: '0 0 6px',
  };

  const sectionTitleStyle = {
    fontFamily: "'Anton', sans-serif",
    fontWeight: 400,
    fontSize: isMobile ? '34px' : '52px',
    lineHeight: 1,
    letterSpacing: '0.01em',
    textTransform: 'uppercase',
    margin: '0 0 16px',
  };

  const introStyle = {
    fontSize: isMobile ? '15px' : '16px',
    color: '#B8B8B0',
    lineHeight: 1.6,
    margin: '0 0 32px',
    maxWidth: '600px',
  };

  const tableTitleStyle = {
    fontSize: '15px',
    color: '#F5F5F0',
    fontWeight: 600,
    margin: '0 0 10px',
  };

  const thStyle = {
    padding: '12px 16px',
    fontSize: '13px',
    color: '#FFD500',
    fontWeight: 600,
    textAlign: 'left',
    backgroundColor: '#141414',
    whiteSpace: 'nowrap',
  };

  const tdStyle = {
    padding: '12px 16px',
    fontSize: '14px',
    color: '#F5F5F0',
    borderTop: '1px solid #1C1C1C',
    whiteSpace: 'nowrap',
  };

  const stickyFirst = (backgroundColor) => ({
    position: 'sticky',
    left: 0,
    backgroundColor,
    fontWeight: 700,
  });

  function SizeTable({ title, headers, rows }) {
    return (
      <div style={{ marginBottom: '32px' }}>
        <p style={tableTitleStyle}>{title}</p>
        <div
          style={{
            overflowX: 'auto',
            borderRadius: '4px',
            border: '1px solid #262626',
          }}
        >
          <table style={{ width: '100%', minWidth: '420px', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {headers.map((header, i) => (
                  <th
                    key={header}
                    style={i === 0 ? { ...thStyle, ...stickyFirst('#141414') } : thStyle}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => {
                const rowBackground = rowIndex % 2 === 0 ? '#0A0A0A' : '#101010';
                return (
                  <tr key={row[0]} style={{ backgroundColor: rowBackground }}>
                    {row.map((cell, i) => (
                      <td
                        key={i}
                        style={i === 0 ? { ...tdStyle, ...stickyFirst(rowBackground) } : tdStyle}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  const bodyTextStyle = {
    fontSize: '15px',
    color: '#B8B8B0',
    lineHeight: 1.65,
    margin: 0,
  };

  const strongStyle = { color: '#F5F5F0' };

  return (
    <div style={{ backgroundColor: '#0A0A0A', minHeight: '100vh', color: '#F5F5F0' }}>
      <style>{`
        .ek-info-chips::-webkit-scrollbar { display: none; }
        .ek-chip:hover { border-color: #FFD500 !important; }
        .ek-chip:focus-visible, .ek-tg:focus-visible { outline: 2px solid #FFD500; outline-offset: 2px; }
        .ek-tg:hover { background-color: #FFE24D !important; }
      `}</style>

      <Header />

      {/* Navegación por secciones */}
      <nav
        aria-label="Secciones de información"
        style={{
          position: 'sticky',
          top: `${headerHeight}px`,
          zIndex: 900,
          backgroundColor: '#0A0A0A',
          borderBottom: '1px solid #262626',
        }}
      >
        <div
          className="ek-info-chips"
          style={{
            display: 'flex',
            gap: '8px',
            overflowX: 'auto',
            maxWidth: '960px',
            margin: '0 auto',
            padding: isMobile ? '10px 16px' : '12px 32px',
            scrollbarWidth: 'none',
          }}
        >
          {sections.map((section) => (
            <button
              key={section.id}
              type="button"
              className="ek-chip"
              onClick={() => scrollToSection(section.id)}
              style={{
                flexShrink: 0,
                minHeight: '40px',
                padding: '0 16px',
                backgroundColor: 'transparent',
                color: '#F5F5F0',
                border: '1px solid #333',
                borderRadius: '4px',
                fontFamily: "'Inter', sans-serif",
                fontSize: '14px',
                fontWeight: 600,
                whiteSpace: 'nowrap',
                cursor: 'pointer',
              }}
            >
              {section.label}
            </button>
          ))}
        </div>
      </nav>

      <div
        style={{
          maxWidth: '960px',
          margin: '0 auto',
          padding: isMobile ? '32px 16px 64px' : '56px 32px 96px',
        }}
      >
        <h1
          style={{
            fontFamily: "'Anton', sans-serif",
            fontWeight: 400,
            fontSize: isMobile ? '44px' : '88px',
            lineHeight: 0.95,
            letterSpacing: '0.01em',
            textTransform: 'uppercase',
            margin: isMobile ? '0 0 48px' : '0 0 80px',
          }}
        >
          Información
        </h1>

        {/* GUÍA DE TALLAS */}
        <section id="tallas" style={sectionStyle}>
          <p style={sectionIndexStyle}>01</p>
          <h2 style={sectionTitleStyle}>Guía de tallas</h2>
          <p style={introStyle}>
            Todas las medidas están en centímetros. Si tienes dudas sobre qué talla elegir,
            contáctanos por Telegram antes de comprar.
          </p>

          <SizeTable
            title="Camisetas — Hombre"
            headers={['Talla', 'Largo', 'Pecho', 'Altura recomendada']}
            rows={[
              ['S', '69', '96', '162–167'],
              ['M', '73', '100', '167–172'],
              ['L', '76', '104', '172–177'],
              ['XL', '79', '108', '177–182'],
              ['XXL', '82', '112', '182–187'],
            ]}
          />

          <SizeTable
            title="Camisetas — Mujer"
            headers={['Talla', 'Pecho', 'Largo', 'Altura recomendada']}
            rows={[
              ['S', '90–94', '65–67', '155–160'],
              ['M', '94–98', '67–69', '160–165'],
              ['L', '98–102', '69–71', '165–170'],
              ['XL', '102–107', '71–73', '170–175'],
            ]}
          />

          <SizeTable
            title="Chándals — Adulto"
            headers={['Talla', 'Largo pantalón', 'Largo top', 'Pecho', 'Hombro', 'Altura recomendada']}
            rows={[
              ['S', '98.5', '68', '100', '75', '155–170'],
              ['M', '101', '70', '104', '77', '165–175'],
              ['L', '104', '72', '108', '79', '170–180'],
              ['XL', '106', '74', '112', '81', '180–195'],
              ['XXL', '109', '76', '116', '83', '195–210'],
            ]}
          />

          <SizeTable
            title="Chándals — Niños"
            headers={['Talla', 'Largo pantalón', 'Largo top', 'Pecho', 'Altura recomendada']}
            rows={[
              ['10', '78', '55', '80', '115–127'],
              ['12', '80', '57.5', '84', '125–137'],
              ['14', '83', '60', '88', '135–147'],
              ['16', '86', '62.5', '92', '145–157'],
              ['18', '89', '65', '96', '155–167'],
            ]}
          />

          <p style={{ fontSize: '14px', color: '#8A8A8A', lineHeight: 1.6, margin: 0 }}>
            ¿No sabes cómo medirte? Compara estas medidas con una prenda que ya tengas y te quede bien.
          </p>
        </section>

        {/* DEVOLUCIONES */}
        <section id="devoluciones" style={sectionStyle}>
          <p style={sectionIndexStyle}>02</p>
          <h2 style={{ ...sectionTitleStyle, marginBottom: '32px' }}>Devoluciones</h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? 'minmax(0, 1fr)' : 'repeat(2, minmax(0, 1fr))',
              gap: isMobile ? '32px' : '56px',
            }}
          >
            <div style={{ borderLeft: '2px solid #FFD500', paddingLeft: '20px' }}>
              <h3 style={{ fontSize: '17px', fontWeight: 600, margin: '0 0 10px' }}>
                Productos personalizados
              </h3>
              <p style={bodyTextStyle}>
                Las camisetas con nombre, número o parches añadidos son productos hechos a medida
                y <strong style={strongStyle}>no admiten devolución ni cambio</strong>,
                salvo que el artículo llegue defectuoso o con un error de fabricación por nuestra
                parte. Revisa bien los datos de personalización antes de confirmar tu pedido.
              </p>
            </div>

            <div style={{ borderLeft: '2px solid #FFD500', paddingLeft: '20px' }}>
              <h3 style={{ fontSize: '17px', fontWeight: 600, margin: '0 0 10px' }}>
                Productos sin personalizar
              </h3>
              <p style={{ ...bodyTextStyle, marginBottom: '12px' }}>
                Dispones de <strong style={strongStyle}>14 días naturales</strong> desde
                la recepción del pedido para solicitar la devolución, conforme a la normativa de
                protección al consumidor. Para que la devolución sea válida, el producto debe:
              </p>
              <ul style={{ ...bodyTextStyle, lineHeight: 1.8, paddingLeft: '20px', margin: '0 0 12px' }}>
                <li>Estar sin usar, sin lavar y con las etiquetas originales</li>
                <li>Devolverse en su embalaje original</li>
                <li>Ir acompañado del número de pedido</li>
              </ul>
              <p style={bodyTextStyle}>
                Los gastos de envío de la devolución corren por cuenta del cliente. Para iniciar
                una devolución, escríbenos por Telegram indicando tu número de pedido.
              </p>
            </div>
          </div>
        </section>

        {/* CUIDADO DE LA ROPA */}
        <section id="cuidado" style={sectionStyle}>
          <p style={sectionIndexStyle}>03</p>
          <h2 style={sectionTitleStyle}>Cuidado de la ropa</h2>
          <p style={introStyle}>
            Sigue estas recomendaciones para que tus prendas te duren en las mejores condiciones.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? 'minmax(0, 1fr)' : 'repeat(2, minmax(0, 1fr))',
              columnGap: '56px',
            }}
          >
            {[
              { title: 'Lavado', text: 'Lava en frío (máx. 30°C) y del revés, para proteger estampados y números.' },
              { title: 'Secado', text: 'Evita la secadora. Deja secar al aire, a la sombra y estirada.' },
              { title: 'Plancha', text: 'No planches directamente sobre estampados, nombres o parches.' },
              { title: 'Lejía', text: 'No uses lejía ni suavizante en exceso, deterioran las fibras técnicas.' },
            ].map((item) => (
              <div
                key={item.title}
                style={{
                  borderTop: '1px solid #262626',
                  padding: '20px 0 28px',
                }}
              >
                <h3
                  style={{
                    fontFamily: "'Anton', sans-serif",
                    fontWeight: 400,
                    fontSize: '24px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.02em',
                    color: '#FFD500',
                    margin: '0 0 8px',
                  }}
                >
                  {item.title}
                </h3>
                <p style={bodyTextStyle}>{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Cierre */}
        <div
          style={{
            backgroundColor: '#141414',
            borderRadius: '4px',
            padding: isMobile ? '24px 16px' : '40px',
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: isMobile ? 'stretch' : 'center',
            justifyContent: 'space-between',
            gap: '20px',
          }}
        >
          <div>
            <p
              style={{
                fontFamily: "'Anton', sans-serif",
                fontSize: isMobile ? '26px' : '34px',
                textTransform: 'uppercase',
                margin: '0 0 6px',
              }}
            >
              ¿Tienes dudas?
            </p>
            <p style={{ ...bodyTextStyle, fontSize: '15px' }}>
              Escríbenos por Telegram y te ayudamos con tallas, pedidos o devoluciones.
            </p>
          </div>
          <a
            href="https://t.me/ElevenKits10"
            target="_blank"
            rel="noopener noreferrer"
            className="ek-tg"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '52px',
              padding: '0 32px',
              backgroundColor: '#FFD500',
              color: '#0A0A0A',
              borderRadius: '4px',
              fontSize: '16px',
              fontWeight: 700,
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              boxSizing: 'border-box',
            }}
          >
            Abrir Telegram
          </a>
        </div>
      </div>
    </div>
  );
}

export default InfoPage;