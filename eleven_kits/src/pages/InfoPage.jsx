import Header from '../components/Header';
import { useIsMobile } from '../useIsMobile';

function InfoPage() {
  const isMobile = useIsMobile();

  const sectionStyle = {
    marginBottom: isMobile ? '40px' : '56px',
  };

  const titleStyle = {
    fontFamily: "'Anton', sans-serif",
    fontSize: isMobile ? '20px' : '26px',
    letterSpacing: '1px',
    marginBottom: '8px',
    color: '#FFD500',
  };

  const subTitleStyle = {
    fontSize: isMobile ? '13px' : '14px',
    color: '#8A8A8A',
    marginBottom: '20px',
    lineHeight: 1.6,
  };

  const tableWrapStyle = {
    overflowX: 'auto',
    marginBottom: '24px',
    borderRadius: '8px',
    border: '1px solid #262626',
  };

  const thStyle = {
    padding: isMobile ? '8px 10px' : '10px 14px',
    fontSize: isMobile ? '11px' : '13px',
    color: '#FFD500',
    fontWeight: 600,
    textAlign: 'left',
    backgroundColor: '#1C1C1C',
    whiteSpace: 'nowrap',
  };

  const tdStyle = {
    padding: isMobile ? '8px 10px' : '10px 14px',
    fontSize: isMobile ? '11px' : '13px',
    color: '#F5F5F0',
    borderTop: '1px solid #1C1C1C',
    whiteSpace: 'nowrap',
  };

  const tableTitleStyle = {
    fontSize: '13px',
    color: '#F5F5F0',
    fontWeight: 600,
    marginBottom: '10px',
    marginTop: '20px',
  };

  return (
    <div style={{ backgroundColor: '#0A0A0A', minHeight: '100vh', color: '#F5F5F0' }}>
      <Header />

      <div style={{
        maxWidth: '820px',
        margin: '0 auto',
        padding: isMobile ? '24px 16px 60px' : '48px 24px 80px',
      }}>
        <h1 style={{
          fontFamily: "'Anton', sans-serif",
          fontSize: isMobile ? '26px' : '36px',
          letterSpacing: '1px',
          marginBottom: isMobile ? '32px' : '48px',
        }}>
          INFORMACIÓN
        </h1>

        {/* GUÍA DE TALLAS */}
        <section style={sectionStyle}>
          <p style={titleStyle}>GUÍA DE TALLAS</p>
          <p style={subTitleStyle}>
            Todas las medidas están en centímetros. Si tienes dudas sobre qué talla elegir, contáctanos por WhatsApp o Instagram antes de comprar.
          </p>

          <p style={tableTitleStyle}>Camisetas — Hombre</p>
          <div style={tableWrapStyle}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={thStyle}>Talla</th>
                  <th style={thStyle}>Largo</th>
                  <th style={thStyle}>Pecho</th>
                  <th style={thStyle}>Altura recomendada</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['S', '69', '96', '162–167'],
                  ['M', '73', '100', '167–172'],
                  ['L', '76', '104', '172–177'],
                  ['XL', '79', '108', '177–182'],
                  ['XXL', '82', '112', '182–187'],
                ].map((row) => (
                  <tr key={row[0]}>
                    {row.map((cell, i) => (
                      <td key={i} style={tdStyle}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p style={tableTitleStyle}>Camisetas — Mujer</p>
          <div style={tableWrapStyle}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={thStyle}>Talla</th>
                  <th style={thStyle}>Pecho</th>
                  <th style={thStyle}>Largo</th>
                  <th style={thStyle}>Altura recomendada</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['S', '90–94', '65–67', '155–160'],
                  ['M', '94–98', '67–69', '160–165'],
                  ['L', '98–102', '69–71', '165–170'],
                  ['XL', '102–107', '71–73', '170–175'],
                ].map((row) => (
                  <tr key={row[0]}>
                    {row.map((cell, i) => (
                      <td key={i} style={tdStyle}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p style={tableTitleStyle}>Chándals — Adulto</p>
          <div style={tableWrapStyle}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={thStyle}>Talla</th>
                  <th style={thStyle}>Largo pantalón</th>
                  <th style={thStyle}>Largo top</th>
                  <th style={thStyle}>Pecho</th>
                  <th style={thStyle}>Hombro</th>
                  <th style={thStyle}>Altura recomendada</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['S', '98.5', '68', '100', '75', '155–170'],
                  ['M', '101', '70', '104', '77', '165–175'],
                  ['L', '104', '72', '108', '79', '170–180'],
                  ['XL', '106', '74', '112', '81', '180–195'],
                  ['XXL', '109', '76', '116', '83', '195–210'],
                ].map((row) => (
                  <tr key={row[0]}>
                    {row.map((cell, i) => (
                      <td key={i} style={tdStyle}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p style={tableTitleStyle}>Chándals — Niños</p>
          <div style={tableWrapStyle}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={thStyle}>Talla</th>
                  <th style={thStyle}>Largo pantalón</th>
                  <th style={thStyle}>Largo top</th>
                  <th style={thStyle}>Pecho</th>
                  <th style={thStyle}>Altura recomendada</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['10', '78', '55', '80', '115–127'],
                  ['12', '80', '57.5', '84', '125–137'],
                  ['14', '83', '60', '88', '135–147'],
                  ['16', '86', '62.5', '92', '145–157'],
                  ['18', '89', '65', '96', '155–167'],
                ].map((row) => (
                  <tr key={row[0]}>
                    {row.map((cell, i) => (
                      <td key={i} style={tdStyle}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
            ¿No sabes cómo medirte? Compara estas medidas con una prenda que ya tengas y te quede bien.
          </p>
        </section>

        {/* DEVOLUCIONES */}
        <section style={sectionStyle}>
          <p style={titleStyle}>DEVOLUCIONES</p>

          <div style={{
            backgroundColor: '#1C1C1C',
            border: '1px solid #262626',
            borderRadius: '8px',
            padding: isMobile ? '18px' : '24px',
            marginBottom: '16px',
          }}>
            <p style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: '#F5F5F0' }}>
              Productos personalizados
            </p>
            <p style={{ fontSize: '13px', color: '#8A8A8A', lineHeight: 1.6 }}>
              Las camisetas con nombre, número o parches añadidos son productos hechos a medida
              y <strong style={{ color: '#F5F5F0' }}>no admiten devolución ni cambio</strong>,
              salvo que el artículo llegue defectuoso o con un error de fabricación por nuestra
              parte. Revisa bien los datos de personalización antes de confirmar tu pedido.
            </p>
          </div>

          <div style={{
            backgroundColor: '#1C1C1C',
            border: '1px solid #262626',
            borderRadius: '8px',
            padding: isMobile ? '18px' : '24px',
          }}>
            <p style={{ fontSize: '14px', fontWeight: 600, marginBottom: '8px', color: '#F5F5F0' }}>
              Productos sin personalizar
            </p>
            <p style={{ fontSize: '13px', color: '#8A8A8A', lineHeight: 1.6, marginBottom: '10px' }}>
              Dispones de <strong style={{ color: '#F5F5F0' }}>14 días naturales</strong> desde
              la recepción del pedido para solicitar la devolución, conforme a la normativa de
              protección al consumidor. Para que la devolución sea válida, el producto debe:
            </p>
            <ul style={{ fontSize: '13px', color: '#8A8A8A', lineHeight: 1.8, paddingLeft: '18px' }}>
              <li>Estar sin usar, sin lavar y con las etiquetas originales</li>
              <li>Devolverse en su embalaje original</li>
              <li>Ir acompañado del número de pedido</li>
            </ul>
            <p style={{ fontSize: '13px', color: '#8A8A8A', lineHeight: 1.6, marginTop: '10px' }}>
              Los gastos de envío de la devolución corren por cuenta del cliente. Para iniciar
              una devolución, escríbenos por WhatsApp indicando tu número de pedido.
            </p>
          </div>
        </section>

        {/* CUIDADO DE LA ROPA */}
        <section style={sectionStyle}>
          <p style={titleStyle}>CUIDADO DE LA ROPA</p>
          <p style={subTitleStyle}>
            Sigue estas recomendaciones para que tus prendas te duren en las mejores condiciones.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            gap: '12px',
          }}>
            {[
              { title: 'Lavado', text: 'Lava en frío (máx. 30°C) y del revés, para proteger estampados y números.' },
              { title: 'Secado', text: 'Evita la secadora. Deja secar al aire, a la sombra y estirada.' },
              { title: 'Plancha', text: 'No planches directamente sobre estampados, nombres o parches.' },
              { title: 'Lejía', text: 'No uses lejía ni suavizante en exceso, deterioran las fibras técnicas.' },
            ].map((item) => (
              <div
                key={item.title}
                style={{
                  backgroundColor: '#1C1C1C',
                  border: '1px solid #262626',
                  borderRadius: '8px',
                  padding: '16px',
                }}
              >
                <p style={{ fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: '#FFD500' }}>
                  {item.title}
                </p>
                <p style={{ fontSize: '12px', color: '#8A8A8A', lineHeight: 1.6 }}>
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

export default InfoPage;