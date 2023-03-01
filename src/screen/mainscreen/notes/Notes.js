import {
  StyleSheet,
  Text,
  View,
  Alert,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Header from '../../../components/layout/Header';
import {COLORS, constants, FONTS, SIZES} from '../../../constants';
import {FAB} from 'react-native-paper';
import ApiMethod from '../../../Services/APIService';
import {useSelector} from 'react-redux';
import {RefreshControl} from 'react-native';
import {Modal} from 'react-native';
//   import MeetingFilter from './MeetingFilter';
import MeetingFilter from '../meeting/MeetingFilter';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {AddNotes} from '../..';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useCallback} from 'react';
import ViewNotes from './ViewNotes';

const Notes = ({navigation}) => {
  const token = useSelector(state => state?.user?.user);
  console.log('token', token);
  const [listState, setListState] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [filterData, setFilterData] = useState({}); //filter data
  const [filterModal, setFilterModal] = useState(false);
  const [addNotesModal, setAddNotesModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [iconModal, setIconModal] = useState('');
  const [lengthMore, setLengthMore] = useState('');
  const [textShown, setTextShown] = useState(false);

  const [agendaText, setAgendaText] = useState(false);

  const handelNotesList = async () => {
    const url = constants.endPoint.notes;
    const params = {
      page: 1,
      per_page_record: '10',
    };
    setIsRefreshing(true);
    try {
      const result = await ApiMethod.postData(url, params, token);
      console.log('result', result?.data?.data?.data, 'url', url);
      setListState(result?.data?.data?.data);
      setIsRefreshing(false);
      return;
    } catch (error) {
      console.log('error', error);
    }
  };

  const handleDelete = async id => {
    const url = constants.endPoint.note + '/' + id;
    setIsRefreshing(true);
    try {
      const result = await ApiMethod.deleteData(url, null, token);
      console.log('result', result?.data?.data);
      //   setListState(result?.data?.data);
      handelNotesList();
      setIsRefreshing(false);
      return;
    } catch (error) {
      console.log('error', error);
    }
  };

  useEffect(() => {
    handelNotesList();
  }, [page]);

  const onTextLayout = e => {
    setLengthMore(e.nativeEvent.lines.length >= 3); //to check the text is more than 4 lines or not
    // console.log(e.nativeEvent);
  };

  return (
    <>
      <Header
        userName={'Niharika'}
        userTitle={'manager'}
        searchBar={true}
        rightIcon={true}
        leftIcon={true}
        onPressArrow={() => navigation.goBack()}
        onPressSort={() => setFilterModal(!filterModal)}
        userProfile={true}
      />

      <FlatList
        data={listState}
        keyExtractor={item => item.id}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => {
              handelNotesList(null, true);
            }}
          />
        }
        renderItem={({item, index}) => {
          return (
            <>
              <View
                style={{
                  backgroundColor: COLORS.support3_08,
                  margin: 10,
                  borderRadius: SIZES.radius,
                  padding: SIZES.padding,
                  elevation: 2,
                }}
              >
                {iconModal === index ? (
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      zIndex: 2,
                      width: '100%',
                      height: '100%',
                      margin: 40,
                      position: 'absolute',
                      backgroundColor: COLORS.support5,
                      borderBottomRightRadius: SIZES.radius,
                      borderTopLeftRadius: SIZES.radius,
                    }}
                  >
                    <View
                      style={{
                        justifyContent: 'space-around',
                        flexDirection: 'row',
                      }}
                    >
                      <AntDesign
                        onPress={() => setIconModal('')}
                        name="close"
                        size={25}
                        color={COLORS.light}
                      />
                      <TouchableOpacity
                        onPress={() => {
                          handleDelete(id);
                          navigation.navigate('Notes');
                        }}
                      >
                        <AntDesign
                          name="delete"
                          size={20}
                          color={COLORS.error}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => navigation.navigate('ViewNotes', item)}
                      >
                        <AntDesign
                          name="eyeo"
                          size={20}
                          color={COLORS.support3}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : null}
                <TouchableOpacity
                  onPress={() => {
                    setIconModal(index);
                  }}
                  style={{
                    position: 'absolute',
                    alignSelf: 'flex-end',
                    marginTop: 10,
                  }}
                >
                  <Ionicons
                    name="ellipsis-vertical"
                    size={30}
                    color={COLORS.dark}
                  />
                </TouchableOpacity>

                <View style={{flexDirection: 'row'}}>
                  <Text
                    style={{width: '50%', ...FONTS.base, fontWeight: '700'}}
                  >
                    {' '}
                    Create By :{' '}
                  </Text>
                  <Text>{item.created_by.name}</Text>
                </View>

                <View style={{flexDirection: 'row'}}>
                  <Text
                    style={{width: '50%', ...FONTS.base, fontWeight: '700'}}
                  >
                    {' '}
                    Meeting Agenda :{' '}
                  </Text>

                  <Text
                    onTextLayout={onTextLayout}
                    numberOfLines={textShown ? undefined : 1}
                    style={{width: '50%'}}
                  >
                    {item?.meeting?.agenda_of_meeting}
                  </Text>
                </View>

                <Text
                  style={{
                    width: '100%',
                    ...FONTS.base,
                    fontWeight: '700',
                    textAlign: 'center',
                    marginTop: 10,
                  }}
                >
                  Decision
                </Text>
                <Text
                  onTextLayout={onTextLayout}
                  numberOfLines={textShown ? undefined : 3}
                  style={{lineHeight: 21}}
                >
                  {item.decision}
                </Text>

                {/* {!lengthMore ? (
                  <Text
                    onPress={() => setAgendaText(agendaText)}
                    style={{
                      lineHeight: 21,
                      marginTop: 10,
                      color: COLORS.support5,
                    }}
                  >
                    {agendaText ? 'Read less...' : 'Read more...'}
                  </Text>
                ) : null} */}
              </View>
            </>
          );
        }}
        onEndReached={() => {
          handelNotesList(page + 1);
        }}
        onEndReachedThreshold={0.1}
        ListFooterComponent={() => (
          <ActivityIndicator size={'large'} color={'rosybrown'} />
        )}
      />
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => setAddNotesModal(true)}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={filterModal}
        onRequestClose={() => {
          //   Alert.alert('Modal has been closed.');
          setFilterModal(!filterModal);
        }}
      >
        <View
          style={{
            flex: 1,
            width: '100%',
            padding: SIZES.padding,
            borderRadius: SIZES.radius,
            backgroundColor: COLORS.gray,
          }}
        >
          <View
            style={{
              marginBottom: 20,
              backgroundColor: COLORS.support1,
              padding: SIZES.padding,
              borderRadius: SIZES.radius,
            }}
          >
            <MeetingFilter
              filterData={filterData}
              setFilterModal={setFilterModal}
              filterModal={filterModal}
            />
          </View>
        </View>
      </Modal>

      {/* add notes modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={addNotesModal}
        onRequestClose={() => {
          setAddNotesModal(!addNotesModal);
        }}
      >
        <View
          style={{
            flex: 1,
            width: '100%',
            // padding: SIZES.padding,
            borderRadius: SIZES.radius,
            backgroundColor: COLORS.gray,
          }}
        >
          <View
            style={{
              flex: 1,
              //   marginBottom: 20,
              backgroundColor: COLORS.support1,
              padding: SIZES.padding,
              borderRadius: SIZES.radius,
            }}
          >
            <AddNotes
              addNotesModal={addNotesModal}
              setAddNotesModal={setAddNotesModal}
            />
          </View>
        </View>
      </Modal>

      {/* notes view modal  */}

      <Modal
        animationType="slide"
        transparent={true}
        visible={viewModal}
        onRequestClose={() => {
          setViewModal(!viewModal);
        }}
      >
        <View
          style={{
            flex: 1,
            width: '100%',
            // padding: SIZES.padding,
            borderRadius: SIZES.radius,
            backgroundColor: COLORS.gray,
          }}
        >
          <View
            style={{
              flex: 1,
              //   marginBottom: 20,
              backgroundColor: COLORS.support1,
              padding: SIZES.padding,
              borderRadius: SIZES.radius,
            }}
          >
            <ViewNotes viewModal={viewModal} setViewModal={setViewModal} />
          </View>
        </View>
      </Modal>
    </>
  );
};

export default Notes;

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
